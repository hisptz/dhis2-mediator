import {
  Body,
  Headers,
  HttpException,
  Injectable,
  Logger,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import FormData = require('form-data');

@Injectable()
export class DhisService {
  constructor(
    private configService: ConfigService,
    private http: HttpService,
  ) {}

  private _sanitizeHttpHeaders(headers: any, file: any): any {
    return {};
  }

  private _getAuthorizationHeader(): string {
    const username = this.configService.get<string>('dhis.username');
    const password = this.configService.get<string>('dhis.password');
    const apiToken = this.configService.get<string>('dhis.apiToken');
    return apiToken
      ? 'ApiToken ' + apiToken
      : 'Basic ' + btoa(username + ':' + password);
  }

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
    @Headers() headers,
    @Body() body,
    file?: Express.Multer.File,
  ): Promise<any> {
    headers = this._sanitizeHttpHeaders(headers, file);

    const fileData = new FormData();

    if (file) {
      fileData.append('file', file.buffer, { filename: file.originalname });
    }

    const apiEndPoint = this.configService.get<string>('dhis.api');

    const queryKeys = Object.keys(query);

    return new Promise(async (resolve: any, reject: any) => {
      let response;
      try {
        const authorization = this._getAuthorizationHeader();
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
              headers: { ...(headers ?? {}), Authorization: authorization },
            }),
          ).catch((error: any) => {
            this.generateErrorException(error);
          });
        } else if (['POST', 'post'].indexOf(request.method) > -1) {
          response = await firstValueFrom(
            this.http.post(url, file ? fileData : body, {
              headers: {
                ...(headers ?? {}),
                ...(file ? fileData.getHeaders() ?? {} : {}),
                Authorization: authorization,
              },
            }),
          ).catch((error: any) => {
            console.log({
              error,
            });
            this.generateErrorException(error);
          });
        } else if (['PUT', 'put'].indexOf(request.method) > -1) {
          response = await firstValueFrom(
            this.http.put(url, body, {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                ...(headers ?? {}),
                Authorization: authorization,
              },
            }),
          ).catch((error: any) => {
            this.generateErrorException(error);
          });
        } else if (['PATCH', 'patch'].indexOf(request.method) > -1) {
          response = await firstValueFrom(
            this.http.patch(url, body, {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                ...(headers ?? {}),
                Authorization: authorization,
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
    Logger.error(JSON.stringify(error));
    if (error && error.response) {
      const { data } = error?.response;
      const statusCode =
        data && data?.httpStatusCode ? data.httpStatusCode : 500;
      throw new HttpException(data, statusCode);
    } else {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
