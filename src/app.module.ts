import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dhisConfigurations from './config/dhis2.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dhisConfigurations],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
