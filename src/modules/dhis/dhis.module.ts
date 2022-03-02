import { Module } from '@nestjs/common';
import { DhisService } from './services/dhis/dhis.service';
import { DhisController } from './controllers/dhis/dhis.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [ConfigService, DhisService],
  controllers: [DhisController],
  exports: [DhisService],
})
export class DhisModule {}
