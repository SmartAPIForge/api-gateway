import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CodegenService } from './codegen.service';
import { RequiredRole } from '../auth/required-role.decorator';
import { Role } from '../auth/dto/validateHeaderDto';
import { AuthGuard } from '../auth/auth.guard';
import { SafRequest } from 'protos/gen/ts/codegen/codegen';
import { ApiOperation } from '@nestjs/swagger';

@Controller('codegen')
@RequiredRole(Role.DEFAULT)
@UseGuards(AuthGuard)
export class CodegenController {
  private readonly logger = new Logger(CodegenController.name);

  constructor(private readonly codegenService: CodegenService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate code' })
  async generate(@Body() createCodegenDto: SafRequest) {
    this.logger.log(`Generate request: ${JSON.stringify(createCodegenDto)}`);
    return this.codegenService.generate(createCodegenDto);
  }

  @Get('track/:id')
  @ApiOperation({ summary: 'Track code generation' })
  async track(@Param('id') id: string) {
    this.logger.log(`Track request: ${id}`);
    return this.codegenService.track({ id });
  }
}
