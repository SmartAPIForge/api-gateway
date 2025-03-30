import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import {
  ProjectServiceClient,
  GetUniqueUserProjectRequest,
  ProjectResponse,
  GetAllUserProjectsRequest,
  ListOfProjectsResponse,
  InitProjectRequest,
  UpdateProjectRequest,
  ProjectUniqueIdentifier,
  ProjectStatusResponse
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

  async getUniqueUserProject(request: GetUniqueUserProjectRequest): Promise<ProjectResponse> {
    const response = this.projectClient.getUniqueUserProject(request);
    return lastValueFrom(response);
  }

  async getAllUserProjects(request: GetAllUserProjectsRequest): Promise<ListOfProjectsResponse> {
    const response = this.projectClient.getAllUserProjects(request);
    return lastValueFrom(response);
  }

  async initProject(request: InitProjectRequest): Promise<ProjectResponse> {
    const response = this.projectClient.initProject(request);
    return lastValueFrom(response);
  }

  async updateProject(request: UpdateProjectRequest): Promise<ProjectResponse> {
    const response = lastValueFrom(this.projectClient.updateProject(request));
    await this.codegenService.generate({
      data: JSON.stringify(request.data),
    })
    return response;
  }

  watchProjectStatus(request: ProjectUniqueIdentifier): Observable<ProjectStatusResponse> {
    return this.projectClient.watchProjectStatus(request);
  }
}
