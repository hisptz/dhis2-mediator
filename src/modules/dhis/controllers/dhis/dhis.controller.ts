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
} from '@nestjs/common';
import { find } from 'lodash';
import { DhisService } from '../../services/dhis/dhis.service';

@Controller('')
export class DhisController {
  cache = {};
  allowedEndPoints = ['me.json', 'dataStore'];

  constructor(private dhisService: DhisService) {}
  @Get(':endPoint')
  async getAPI(
    @Req() request,
    @Param() param,
    @Query() query,
    @Res() response,
    @Body() body?,
  ): Promise<any> {
    const allowedEndPoint = find(
      this.allowedEndPoints,
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
      this.allowedEndPoints,
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
      this.allowedEndPoints,
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
      this.allowedEndPoints,
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
      this.allowedEndPoints,
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
      this.allowedEndPoints,
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
