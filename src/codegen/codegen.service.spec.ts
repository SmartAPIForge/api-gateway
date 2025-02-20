import { Test, TestingModule } from '@nestjs/testing';
import { CodegenService } from './codegen.service';

describe('CodegenService', () => {
  let service: CodegenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodegenService],
    }).compile();

    service = module.get<CodegenService>(CodegenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
