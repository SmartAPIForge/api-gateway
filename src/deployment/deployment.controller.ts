import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import {
  AddServerRequest,
  ListServersRequest,
  RemoveServerRequest,
} from 'protos/gen/ts/deployment/deployment';
import {
  AddServerRequestDto, AddServerResponseDto,
  ListServersResponseDto, RemoveServerResponseDto
} from './dto/base'
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";

@Controller('deployment')
export class DeploymentController {
  private readonly logger = new Logger(DeploymentController.name);

  constructor(private readonly deploymentService: DeploymentService) {}

  @Get('servers')
  @ApiOperation({ summary: 'List all servers' })
  @ApiResponse({ status: 200, description: 'List of servers', type: ListServersResponseDto })
  async getAllServers(@Req() req: ListServersRequest) {
    this.logger.log(`List servers request`);
    return await this.deploymentService.getAllServers(req);
  }

  @Post('servers')
  @ApiOperation({ summary: 'Add a new server' })
  @ApiBody({ type: AddServerRequestDto })
  @ApiResponse({ status: 200, description: 'The added server', type: AddServerResponseDto })
  async addServer(@Body() req: AddServerRequest) {
    this.logger.log(`Add server request: ${JSON.stringify(req)}`);
    return await this.deploymentService.addServer(req);
  }

  @Delete('servers/:id')
  @ApiOperation({ summary: 'Remove a server' })
  @ApiParam({ name: 'id', type: Number, description: 'Server ID' })
  @ApiResponse({ status: 200, description: 'Status of the remove operation', type: RemoveServerResponseDto })
  async removeServer(@Param('id') id: number) {
    this.logger.log(`Remove server request: ${id}`);
    const req: RemoveServerRequest = { id };
    return await this.deploymentService.removeServer(req);
  }
}
