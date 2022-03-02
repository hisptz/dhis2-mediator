import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  HttpException,
  Param,
  Query,
  Req,
  Res,
  Delete,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { find } from 'lodash';
import { DhisService } from '../../services/dhis/dhis.service';

@Controller('')
export class DhisController {
  cache: any = {};
  allowedResources: string[];
  readonlyResources: string[];

  constructor(
    private configService: ConfigService,
    private dhisService: DhisService,
  ) {
    this.allowedResources = configService.get<string[]>(
      'dhis.allowedResources',
    );
    this.readonlyResources = configService.get<string[]>(
      'dhis.readonlyResources',
    );
  }

  @Delete('cache')
  async clearCache() {
    this.cache = {};
    return {
      code: 200,
      message: 'Cache cleared',
    };
  }

  @Get(':endPoint')
  async getAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Body() body?,
  ): Promise<any> {
    const allowedEndPoint = find(
      [...this.readonlyResources, ...this.allowedResources],
      (endPoint) => param.endPoint.indexOf(endPoint) !== -1,
    );
    if (allowedEndPoint) {
      const results = await this.dhisService.getAPI(
        request,
        param,
        query,
        body,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Get(':endPoint/*')
  async getExtendedPointAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Body() body?,
  ): Promise<any> {
    const path = decodeURI(request.url).split('/api/').join('');
    const allowedEndPoint = find(
      [...this.readonlyResources, ...this.allowedResources],
      (endPoint) => path.indexOf(endPoint) !== -1,
    );
    if (allowedEndPoint) {
      if (this.cache[path]) {
        response.status(200);
        response.send(this.cache[path]);
      } else {
        const results = await this.dhisService.getAPI(
          request,
          param,
          query,
          body,
        );
        response.status(200);
        response.send(results);
        this.cache[path] = results;
      }
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Post(':endPoint')
  async postAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Body() body?,
  ): Promise<any> {
    const allowedEndPoint = find(
      this.allowedResources,
      (endPoint) => param.endPoint.indexOf(endPoint) !== -1,
    );
    if (allowedEndPoint) {
      const results = await this.dhisService.getAPI(
        request,
        param,
        query,
        body,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Post(':endPoint/*')
  async postExtendedPointAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Body() body?,
  ): Promise<any> {
    const path = decodeURI(request.url).split('/api/').join('');
    const allowedEndPoint = find(
      this.allowedResources,
      (endPoint) => path.indexOf(endPoint) !== -1,
    );
    if (allowedEndPoint) {
      const results = await this.dhisService.getAPI(
        request,
        param,
        query,
        body,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Put(':endPoint')
  async putAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Body() body?,
  ): Promise<any> {
    const allowedEndPoint = find(
      this.allowedResources,
      (endPoint) => param.endPoint.indexOf(endPoint) !== -1,
    );
    if (allowedEndPoint) {
      const results = await this.dhisService.getAPI(
        request,
        param,
        query,
        body,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Put(':endPoint/*')
  async putExtendedPointAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Body() body?,
  ): Promise<any> {
    const path = decodeURI(request.url).split('/api/').join('');
    const allowedEndPoint = find(
      this.allowedResources,
      (endPoint) => path.indexOf(endPoint) !== -1,
    );
    if (allowedEndPoint) {
      const results = await this.dhisService.getAPI(
        request,
        param,
        query,
        body,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }
}
