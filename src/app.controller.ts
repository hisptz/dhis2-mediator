import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): {
    code: HttpStatus;
    message: string;
  } {
    try {
      const message = this.appService.getWelcomeMessage();
      return {
        code: HttpStatus.OK,
        message,
      };
    } catch (error: any) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
