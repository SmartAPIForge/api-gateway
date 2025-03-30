import { PartialType } from '@nestjs/mapped-types';
import { CreateCodegenDto } from './create-codegen.dto';

export class UpdateCodegenDto extends PartialType(CreateCodegenDto) {
  id: number;
}
