import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '../auth/auth.guard';
import { RequiredRole } from '../auth/required-role.decorator';
import { Role } from '../auth/dto/validateHeaderDto';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  GetUniqueUserProjectRequest,
  GetAllUserProjectsRequest,
  InitProjectRequest,
  ProjectUniqueIdentifier,
  UpdateProjectRequest
} from 'protos/gen/ts/project/project';
import { Observable, map } from 'rxjs';

@Controller('project')
@UseGuards(AuthGuard)
@RequiredRole(Role.DEFAULT)
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) {}

  @Get(':owner/:name')
  @ApiOperation({ summary: 'Get a specific project' })
  @ApiParam({ name: 'owner', description: 'Project owner' })
  @ApiParam({ name: 'name', description: 'Project name' })
  async getProject(@Param('owner') owner: string, @Param('name') name: string) {
    const request: GetUniqueUserProjectRequest = {
      composeId: { owner, name }
    };
    this.logger.log(`Get project request: ${JSON.stringify(request)}`);
    return this.projectService.getUniqueUserProject(request);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all projects for a user' })
  @ApiQuery({ name: 'owner', description: 'Project owner' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false })
  async getAllProjects(
    @Query('owner') owner: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const request: GetAllUserProjectsRequest = {
      owner,
      page: page || '1',
      limit: limit || '10'
    };
    this.logger.log(`Get all projects request: ${JSON.stringify(request)}`);
    return this.projectService.getAllUserProjects(request);
  }

  @Post('init')
  @ApiOperation({ summary: 'Initialize a new project' })
  async initProject(@Body() request: InitProjectRequest) {

    this.logger.log(`Init project request: ${JSON.stringify(request)}`);
    return this.projectService.initProject(request);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update a project' })
  async updateProject(@Body() request: UpdateProjectRequest) {
    this.logger.log(`Update project request: ${JSON.stringify(request)}`);
    return this.projectService.updateProject(request);
  }

  @Sse(':owner/:name/status')
  @ApiOperation({ summary: 'Watch project status changes' })
  @ApiParam({ name: 'owner', description: 'Project owner' })
  @ApiParam({ name: 'name', description: 'Project name' })
  watchProjectStatus(@Param('owner') owner: string, @Param('name') name: string): Observable<{ data: any }> {
    const request: ProjectUniqueIdentifier = { owner, name };
    this.logger.log(`Watch project status request: ${JSON.stringify(request)}`);
    return this.projectService.watchProjectStatus(request).pipe(
      map(event => ({ data: event }))
    );
  }
}
