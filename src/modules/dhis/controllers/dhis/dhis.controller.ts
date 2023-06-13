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
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { find } from 'lodash';
import { DhisService } from '../../services/dhis/dhis.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Controller('')
export class DhisController {
  allowedResources: string[];
  readonlyResources: string[];

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  private async _getCachedData(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  private async _setCachedData(key: string, value: any): Promise<any> {
    return await this.cacheManager.set(key, value, 40000);
  }

  shouldBeCached(urlEndPoint: string): boolean {
    const shouldBeCached = find(
      [...this.readonlyResources],
      (endPoint) => urlEndPoint.indexOf(endPoint) !== -1,
    );
    return shouldBeCached ? true : false;
  }

  @Delete('cache')
  async clearCache() {
    await this.cacheManager.reset();
    return {
      code: 202,
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
    const path = decodeURI(request.url).split('/api/').join('');
    const allowedEndPoint = find(
      [...this.readonlyResources, ...this.allowedResources],
      (endPoint) => param.endPoint.indexOf(endPoint) !== -1,
    );
    if (allowedEndPoint) {
      const cachedData = await this._getCachedData(path);

      if (this.shouldBeCached(path) && cachedData) {
        response.status(200);
        response.send(cachedData);
      } else {
        const results = await this.dhisService.getAPI(
          request,
          param,
          query,
          body,
        );
        await this._setCachedData(path, results);
        response.status(200);
        response.send(results);
      }
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
      const cachedData = await this._getCachedData(path);
      if (this.shouldBeCached(path) && cachedData) {
        response.status(200);
        response.send(cachedData);
      } else {
        const results = await this.dhisService.getAPI(
          request,
          param,
          query,
          body,
        );
        await this._setCachedData(path, results);
        response.status(200);
        response.send(results);
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
