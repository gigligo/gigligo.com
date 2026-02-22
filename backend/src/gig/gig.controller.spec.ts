import { Test, TestingModule } from '@nestjs/testing';
import { GigController } from './gig.controller';

describe('GigController', () => {
  let controller: GigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GigController],
    }).compile();

    controller = module.get<GigController>(GigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
