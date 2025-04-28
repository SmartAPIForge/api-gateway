import {
  Body,
  Controller,
  Delete,
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
  GetAllUserProjectsRequest,
  InitProjectRequest,
  ProjectUniqueIdentifier,
  UpdateProjectRequest,
  GetFilteredProjectsRequest,
  Owner
} from 'protos/gen/ts/project/project';
import { Observable, map } from 'rxjs';

@Controller('projects')
@UseGuards(AuthGuard)
@RequiredRole(Role.DEFAULT)
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) {}

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

  @Get('filtered')
  @ApiOperation({ summary: 'Get filtered projects' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false })
  @ApiQuery({ name: 'owner', description: 'Project owner', required: false })
  @ApiQuery({ name: 'status', description: 'Project status', required: false })
  @ApiQuery({ name: 'namePrefix', description: 'Project name prefix', required: false })
  async getFilteredProjects(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('owner') owner?: string,
    @Query('status') status?: string,
    @Query('namePrefix') namePrefix?: string
  ) {
    const request: GetFilteredProjectsRequest = {
      Page: page || '1',
      Limit: limit || '10',
      Owner: owner || '',
      Status: status || '',
      NamePrefix: namePrefix || ''
    };
    this.logger.log(`Get filtered projects request: ${JSON.stringify(request)}`);
    return this.projectService.getFilteredProjects(request);
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

  @Delete(':owner/:name')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'owner', description: 'Project owner' })
  @ApiParam({ name: 'name', description: 'Project name' })
  async deleteProject(
    @Param('owner') owner: string,
    @Param('name') name: string
  ) {
    const request: ProjectUniqueIdentifier = { owner, name };
    this.logger.log(`Delete project request: ${JSON.stringify(request)}`);
    return this.projectService.deleteProject(request);
  }

  @Sse('updates/:owner')
  @ApiOperation({ summary: 'Stream project updates' })
  @ApiParam({ name: 'owner', description: 'Project owner' })
  streamUserProjectsUpdates(@Param('owner') owner: string): Observable<{ data: any }> {
    const request: Owner = { owner };
    this.logger.log(`Stream project updates request: ${JSON.stringify(request)}`);
    return this.projectService.streamUserProjectsUpdates(request).pipe(
      map(event => ({ data: event }))
    );
  }
}
