import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dhisConfigurations from './config/dhis2.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DhisModule } from './modules/dhis/dhis.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RateLimiterInterceptor } from './interceptors/rate-limiter.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dhisConfigurations],
    }),
    DhisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    },
  ],
})
export class AppModule {}
