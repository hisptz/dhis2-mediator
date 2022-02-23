import { Test, TestingModule } from '@nestjs/testing';
import { DhisController } from './dhis.controller';

describe('DhisController', () => {
  let controller: DhisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DhisController],
    }).compile();

    controller = module.get<DhisController>(DhisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
