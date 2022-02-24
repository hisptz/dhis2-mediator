import { Test, TestingModule } from '@nestjs/testing';
import { DhisService } from './dhis.service';

describe('DhisService', () => {
  let service: DhisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DhisService],
    }).compile();

    service = module.get<DhisService>(DhisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
