import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const method = request.method;
    const status = exception.getStatus();
    const message = exception.message;

    // TODO - Logging
    response.status(status).json({
      httpStatusCode: status,
      message,
      path: request.url,
      method,
      timestamp: new Date().toISOString(),
    });
  }
}
