import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { find } from 'lodash';
import { DhisService } from '../../services/dhis/dhis.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('')
export class DhisController {
  allowedResources: string[];
  readonlyResources: string[];
  cacheTtl: number;

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
    this.cacheTtl = configService.get<number>('dhis.cacheTtl');
  }

  private async _getCachedData(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  private async _setCachedData(key: string, value: any): Promise<any> {
    return await this.cacheManager.set(key, value, this.cacheTtl ?? 60000);
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
    @Headers() headers,
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
          headers,
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
    @Headers() headers,
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
          headers,
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
  @UseInterceptors(FileInterceptor('file'))
  async postAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Headers() headers,
    @UploadedFile() file: Express.Multer.File,
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
        headers,
        body,
        file,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Post(':endPoint/*')
  @UseInterceptors(FileInterceptor('file'))
  async postExtendedPointAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Headers() headers,
    @UploadedFile() file: Express.Multer.File,
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
        headers,
        body,
        file,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Put(':endPoint')
  @UseInterceptors(FileInterceptor('file'))
  async putAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Headers() headers,
    @UploadedFile() file?: Express.Multer.File,
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
        headers,
        body,
        file,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Put(':endPoint/*')
  @UseInterceptors(FileInterceptor('file'))
  async putExtendedPointAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Headers() headers,
    @UploadedFile() file: Express.Multer.File,
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
        headers,
        body,
        file,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Patch(':endPoint')
  @UseInterceptors(FileInterceptor('file'))
  async patchAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Headers() headers,
    @UploadedFile() file?: Express.Multer.File,
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
        headers,
        body,
        file,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  @Patch(':endPoint/*')
  @UseInterceptors(FileInterceptor('file'))
  async patchExtendedPointAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Headers() headers,
    @UploadedFile() file: Express.Multer.File,
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
        headers,
        body,
        file,
      );
      response.status(200);
      response.send(results);
    } else {
      throw new HttpException('Not Found', 404);
    }
  }
}
