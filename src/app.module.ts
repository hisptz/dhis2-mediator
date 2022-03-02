import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dhisConfigurations from './config/dhis2.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DhisModule } from './modules/dhis/dhis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dhisConfigurations],
    }),
    DhisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
