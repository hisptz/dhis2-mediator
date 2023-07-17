import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private rateLimiter: RateLimiterMemory;

  constructor(private configService: ConfigService) {
    this.rateLimiter = new RateLimiterMemory({
      points:
        configService.get<number>('dhis.numberOfRequestsPerMinute') ?? 100, // Maximum number of requests
      duration: 60, // Time window in seconds
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest();
    const response: Response = httpContext.getResponse();

    const clientId = request.ip;

    try {
      await this.rateLimiter.consume(clientId);
      return next.handle();
    } catch (error) {
      response
        .status(429)
        .json({ error: 'Too many requests, please try again later.' });
    }
  }
}
