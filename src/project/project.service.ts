import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import {
  ProjectServiceClient,
  ProjectResponse,
  GetAllUserProjectsRequest,
  ListOfProjectsResponse,
  InitProjectRequest,
  UpdateProjectRequest,
  ProjectUniqueIdentifier,
  DeleteProjectResponse,
  GetFilteredProjectsRequest,
  Owner
} from 'protos/gen/ts/project/project';
import {CodegenService} from "../codegen/codegen.service";

@Injectable()
export class ProjectService {
  private projectClient: ProjectServiceClient;

  constructor(
      @Inject('PROJECT_PACKAGE') private client: ClientGrpc,
      private codegenService: CodegenService,
  ) {
    this.projectClient =
      this.client.getService<ProjectServiceClient>('ProjectService');
  }

  async getAllUserProjects(request: GetAllUserProjectsRequest): Promise<ListOfProjectsResponse> {
    const response = this.projectClient.getAllUserProjects(request);
    return lastValueFrom(response);
  }

  streamUserProjectsUpdates(request: Owner): Observable<ProjectResponse> {
    return this.projectClient.streamUserProjectsUpdates(request);
  }

  async initProject(request: InitProjectRequest): Promise<ProjectResponse> {
    const response = this.projectClient.initProject(request);
    return lastValueFrom(response);
  }

  async updateProject(request: UpdateProjectRequest): Promise<ProjectResponse> {
    const response = lastValueFrom(this.projectClient.updateProject(request));
    await this.codegenService.generate({
      data: request.data,
    })
    return response;
  }

  async getFilteredProjects(request: GetFilteredProjectsRequest): Promise<ListOfProjectsResponse> {
    const response = this.projectClient.getFilteredProjects(request);
    return lastValueFrom(response);
  }

  async deleteProject(request: ProjectUniqueIdentifier): Promise<DeleteProjectResponse> {
    const response = this.projectClient.deleteProject(request);
    return lastValueFrom(response);
  }
}
