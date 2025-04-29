import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Headers,
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
import { Role, ValidateHeaderDto } from '../auth/dto/validateHeaderDto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetAllUserProjectsRequest,
  ProjectUniqueIdentifier,
  GetFilteredProjectsRequest,
  Owner
} from 'protos/gen/ts/project/project';
import {Observable, map, catchError, throwError, interval, mergeWith} from 'rxjs';
import { UsersService } from '../users/users.service';
import {
  GetAllProjectsRequestDto,
  GetFilteredProjectsRequestDto,
  ProjectsListResponseDto,
  DeleteProjectResponseDto,
  ProjectResponseDto,
  InitProjectRequestDto,
  UpdateProjectRequestDto
} from './dto/project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(
    private readonly projectService: ProjectService, 
    private readonly usersService: UsersService,
  ) { }

  @Get()
  @RequiredRole(Role.DEFAULT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all projects for a user' })
  @ApiResponse({ type: ProjectsListResponseDto, status: 200 })
  async getAllProjects(
    @Headers() headers: ValidateHeaderDto,
    @Query() query: GetAllProjectsRequestDto,
  ) {
    const user = await this.usersService.getUserByToken({
      AccessToken: headers.authorization,
    });

    const request: GetAllUserProjectsRequest = {
      owner: user.Username,
      page: query.page || '1',
      limit: query.limit || '10'
    };
    this.logger.log(`Get all projects request: ${JSON.stringify(request)}`);
    return this.projectService.getAllUserProjects(request);
  }

  @Get('filtered')
  @RequiredRole(Role.ADMIN)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get filtered projects' })
  @ApiResponse({ type: ProjectsListResponseDto, status: 200 })
  async getFilteredProjects(
    @Query() query: GetFilteredProjectsRequestDto
  ) {
    const request: GetFilteredProjectsRequest = {
      Page: query.page || '1',
      Limit: query.limit || '10',
      Owner: query.owner || '',
      Status: query.status || '',
      NamePrefix: query.namePrefix || ''
    };
    this.logger.log(`Get filtered projects request: ${JSON.stringify(request)}`);
    return this.projectService.getFilteredProjects(request);
  }

  @Post('init')
  @RequiredRole(Role.DEFAULT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Initialize a new project' })
  @ApiBody({ type: InitProjectRequestDto })
  @ApiResponse({ type: ProjectResponseDto, status: 201 })
  async initProject(
    @Headers() headers: ValidateHeaderDto,
    @Body() request: InitProjectRequestDto
  ) {
    this.logger.log(`Init project request: ${JSON.stringify(request)}`);

    const user = await this.usersService.getUserByToken({
      AccessToken: headers.authorization,
    });

    return this.projectService.initProject({
      composeId: {
        name: request.name,
        owner: user.Username,
      }
    });
  }

  @Put('update')
  @RequiredRole(Role.DEFAULT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a project' })
  @ApiBody({ type: UpdateProjectRequestDto })
  @ApiResponse({ type: ProjectResponseDto, status: 200 })
  async updateProject(
    @Headers() headers: ValidateHeaderDto,
    @Body() request: UpdateProjectRequestDto
  ) {
    this.logger.log(`Update project request: ${JSON.stringify(request)}`);

    const user = await this.usersService.getUserByToken({
      AccessToken: headers.authorization,
    });

    return this.projectService.updateProject({
      composeId: {
        name: request.name,
        owner: user.Username,
      },
      data: request.data,
    });
  }

  @Delete(':owner/:name')
  @RequiredRole(Role.DEFAULT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'owner', description: 'Project owner' })
  @ApiParam({ name: 'name', description: 'Project name' })
  @ApiResponse({ type: DeleteProjectResponseDto, status: 200 })
  async deleteProject(
    @Param('owner') owner: string,
    @Param('name') name: string
  ) {
    const request: ProjectUniqueIdentifier = { owner, name };
    this.logger.log(`Delete project request: ${JSON.stringify(request)}`);
    return this.projectService.deleteProject(request);
  }

  @Sse('updates')
  @ApiOperation({ summary: 'Stream project updates' })
  @ApiResponse({ type: ProjectResponseDto, status: 200 })
  async streamUserProjectsUpdates(
      @Query('token') token: string,
  ): Promise<Observable<{ data: any }>> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    try {
      const user = await this.usersService.getUserByToken({
        AccessToken: token,
      });

      const request: Owner = { owner: user.Username };
      this.logger.log(`Stream project updates request: ${JSON.stringify(request)}`);

      return this.projectService.streamUserProjectsUpdates(request).pipe(
        map(event => ({ data: event })),
        mergeWith(interval(30000).pipe(
          map(() => ({ data: { type: 'heartbeat' } }))
        )),
        catchError(error => {
          this.logger.error(`Stream error: ${error.message}`);
          return throwError(() => new Error('Stream error occurred'));
        })
      );
    } catch (error) {
      this.logger.error(`Failed to initialize SSE stream: ${error.message}`);
      throw error;
    }
  }
}
