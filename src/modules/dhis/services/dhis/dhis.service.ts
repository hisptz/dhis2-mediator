import {
  Body,
  HttpException,
  Injectable,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class DhisService {
  constructor(
    private configService: ConfigService,
    private http: HttpService,
  ) {}

  getOtherParam(param) {
    return (
      (Object.keys(param).filter((p: any) => !isNaN(p)).length > 0 ? '/' : '') +
      Object.keys(param)
        .filter((p: any) => !isNaN(p))
        .map((p) => param[p])
        .join('/')
    );
  }

  async getAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Body() body,
  ): Promise<any> {
    const apiEndPoint = this.configService.get<string>('dhis.api');
    const username = this.configService.get<string>('dhis.username');
    const password = this.configService.get<string>('dhis.password');

    const queryKeys = Object.keys(query);

    return new Promise(async (resolve: any, reject: any) => {
      let response;
      try {
        const url =
          queryKeys.length > 0
            ? `${apiEndPoint}/api/${param.endPoint}${this.getOtherParam(
                param,
              )}?${Object.keys(query)
                .map((q) => {
                  return `${q}=${query[q]}`;
                })
                .join('&')}`
            : `${apiEndPoint}/api/${param.endPoint}${this.getOtherParam(
                param,
              )}`;
        if (['GET', 'get'].indexOf(request.method) > -1) {
          response = await firstValueFrom(
            this.http.get(url, {
              auth: {
                username: username,
                password: password,
              },
            }),
          ).catch((error: any) => {
            this.generateErrorException(error);
          });
        } else if (['POST', 'post'].indexOf(request.method) > -1) {
          response = await firstValueFrom(
            this.http.post(url, body, {
              auth: {
                username: username,
                password: password,
              },
            }),
          ).catch((error: any) => {
            this.generateErrorException(error);
          });
        } else if (['PUT', 'put'].indexOf(request.method) > -1) {
          response = await firstValueFrom(
            this.http.put(url, body, {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
              },
              auth: {
                username: username,
                password: password,
              },
            }),
          ).catch((error: any) => {
            this.generateErrorException(error);
          });
        }
        if (response && response.data) {
          resolve(response.data);
        } else {
          resolve(response);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  generateErrorException(error: any) {
    const { data } = error?.response;
    const statusCode = data && data.httpStatusCode ? data.httpStatusCode : 500;
    const message =
      data && data.message ? data.message : 'Internal Server Error';
    throw new HttpException(message, statusCode);
  }
}
