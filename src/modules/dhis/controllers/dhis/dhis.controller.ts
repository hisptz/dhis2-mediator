import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { find } from 'lodash';
import { DhisService } from '../../services/dhis/dhis.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  shouldBeCached(urlEndPoint: string): boolean {
    const shouldBeCached = find(
      [...this.readonlyResources],
      (endPoint) => urlEndPoint.indexOf(endPoint) !== -1,
    );
    return shouldBeCached ? true : false;
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
    @Headers() headers,
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
        headers,
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
    @Headers() headers,
    @Body() body?,
  ): Promise<any> {
    const path = decodeURI(request.url).split('/api/').join('');
    const allowedEndPoint = find(
      [...this.readonlyResources, ...this.allowedResources],
      (endPoint) => path.indexOf(endPoint) !== -1,
    );
    if (allowedEndPoint) {
      if (this.shouldBeCached(path) && this.cache[path]) {
        response.status(200);
        response.send(this.cache[path]);
      } else {
        const results = await this.dhisService.getAPI(
          request,
          param,
          query,
          headers,
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
}
