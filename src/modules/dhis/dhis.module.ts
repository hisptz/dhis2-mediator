import { Module } from '@nestjs/common';
import { DhisService } from './services/dhis/dhis.service';
import { DhisController } from './controllers/dhis/dhis.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [ConfigService, DhisService],
  controllers: [DhisController],
  exports: [DhisService],
})
export class DhisModule {}
