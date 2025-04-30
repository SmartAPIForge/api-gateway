import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import {
  AddServerRequest,
  ListServersRequest,
  RemoveServerRequest,
  GetDeploymentRequest,
  ListDeploymentsRequest,
  DeleteDeploymentRequest,
  StartDeploymentRequest,
  StopDeploymentRequest,
} from 'protos/gen/ts/deployment/deployment';
import {
  AddServerRequestDto,
  AddServerResponseDto,
  ListServersResponseDto,
  RemoveServerResponseDto,
  GetDeploymentResponseDto,
  ListDeploymentsResponseDto,
  DeleteDeploymentResponseDto,
  StartDeploymentResponseDto,
  StopDeploymentResponseDto,
} from './dto/base';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RequiredRole } from '../auth/required-role.decorator';
import { Role } from '../auth/dto/validateHeaderDto';

@Controller('deployment')
// @UseGuards(AuthGuard)
// @RequiredRole(Role.ADMIN)
export class DeploymentController {
  private readonly logger = new Logger(DeploymentController.name);

  constructor(private readonly deploymentService: DeploymentService) {}

  @Get()
  @ApiOperation({ summary: 'List all servers' })
  @ApiResponse({
    status: 200,
    description: 'List of servers',
    type: ListServersResponseDto,
  })
  async getAllServers(@Req() req: ListServersRequest) {
    this.logger.log(`List servers request`);
    return await this.deploymentService.getAllServers(req);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new server' })
  @ApiBody({ type: AddServerRequestDto })
  @ApiResponse({
    status: 200,
    description: 'The added server',
    type: AddServerResponseDto,
  })
  async addServer(@Body() req: AddServerRequest) {
    this.logger.log(`Add server request: ${JSON.stringify(req)}`);
    return await this.deploymentService.addServer(req);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remove a server' })
  @ApiParam({ name: 'id', type: Number, description: 'Server ID' })
  @ApiResponse({
    status: 200,
    description: 'Status of the remove operation',
    type: RemoveServerResponseDto,
  })
  async removeServer(@Param('id') id: number) {
    this.logger.log(`Remove server request: ${id}`);
    const req: RemoveServerRequest = { id };
    return await this.deploymentService.removeServer(req);
  }

  @Get('deployments/:id')
  @ApiOperation({ summary: 'Get deployment by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Deployment ID' })
  @ApiResponse({
    status: 200,
    description: 'Deployment details',
    type: GetDeploymentResponseDto,
  })
  async getDeployment(@Param('id') id: string) {
    this.logger.log(`Get deployment request: ${id}`);
    const req: GetDeploymentRequest = { id };
    return await this.deploymentService.getDeployment(req);
  }

  @Get('deployments')
  @ApiOperation({ summary: 'List all deployments' })
  @ApiQuery({ name: 'owner', required: false, description: 'Filter by owner' })
  @ApiResponse({
    status: 200,
    description: 'List of deployments',
    type: ListDeploymentsResponseDto,
  })
  async listDeployments(@Query('owner') owner: string = '') {
    this.logger.log(`List deployments request ${owner ? `for owner: ${owner}` : ''}`);
    const req: ListDeploymentsRequest = { owner };
    return await this.deploymentService.listDeployments(req);
  }

  @Delete('deployments/:id')
  @ApiOperation({ summary: 'Delete a deployment' })
  @ApiParam({ name: 'id', type: String, description: 'Deployment ID' })
  @ApiResponse({
    status: 200,
    description: 'Status of the delete operation',
    type: DeleteDeploymentResponseDto,
  })
  async deleteDeployment(@Param('id') id: string) {
    this.logger.log(`Delete deployment request: ${id}`);
    const req: DeleteDeploymentRequest = { id };
    return await this.deploymentService.deleteDeployment(req);
  }

  @Post('deployments/:id/start')
  @ApiOperation({ summary: 'Start a deployment' })
  @ApiParam({ name: 'id', type: String, description: 'Deployment ID' })
  @ApiResponse({
    status: 200,
    description: 'Updated deployment details',
    type: StartDeploymentResponseDto,
  })
  async startDeployment(@Param('id') id: string) {
    this.logger.log(`Start deployment request: ${id}`);
    const req: StartDeploymentRequest = { id };
    return await this.deploymentService.startDeployment(req);
  }

  @Post('deployments/:id/stop')
  @ApiOperation({ summary: 'Stop a deployment' })
  @ApiParam({ name: 'id', type: String, description: 'Deployment ID' })
  @ApiResponse({
    status: 200,
    description: 'Updated deployment details',
    type: StopDeploymentResponseDto,
  })
  async stopDeployment(@Param('id') id: string) {
    this.logger.log(`Stop deployment request: ${id}`);
    const req: StopDeploymentRequest = { id };
    return await this.deploymentService.stopDeployment(req);
  }
}
