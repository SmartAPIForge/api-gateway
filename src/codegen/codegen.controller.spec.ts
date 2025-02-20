import { Test, TestingModule } from '@nestjs/testing';
import { CodegenController } from './codegen.controller';
import { CodegenService } from './codegen.service';

describe('CodegenController', () => {
  let controller: CodegenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodegenController],
      providers: [CodegenService],
    }).compile();

    controller = module.get<CodegenController>(CodegenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
