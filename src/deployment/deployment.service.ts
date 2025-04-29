import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  AddServerRequest,
  AddServerResponse,
  ListServersRequest,
  ListServersResponse,
  RemoveServerRequest,
  RemoveServerResponse,
  DeploymentServiceClient,
  GetDeploymentRequest,
  GetDeploymentResponse,
  ListDeploymentsRequest,
  ListDeploymentsResponse,
  DeleteDeploymentRequest,
  DeleteDeploymentResponse,
  StartDeploymentRequest,
  StartDeploymentResponse,
  StopDeploymentRequest,
  StopDeploymentResponse,
} from 'protos/gen/ts/deployment/deployment';

@Injectable()
export class DeploymentService {
  private deploymentClient: DeploymentServiceClient;

  constructor(@Inject('DEPLOYMENT_PACKAGE') private client: ClientGrpc) {
    this.deploymentClient =
      this.client.getService<DeploymentServiceClient>('DeploymentService');
  }

  getAllServers(request: ListServersRequest): Promise<ListServersResponse> {
    const listServersResponse = this.deploymentClient.listServers(request);
    return lastValueFrom(listServersResponse);
  }

  addServer(request: AddServerRequest): Promise<AddServerResponse> {
    const addServerResponse = this.deploymentClient.addServer(request);
    return lastValueFrom(addServerResponse);
  }

  removeServer(request: RemoveServerRequest): Promise<RemoveServerResponse> {
    const removeServerResponse = this.deploymentClient.removeServer(request);
    return lastValueFrom(removeServerResponse);
  }

  getDeployment(request: GetDeploymentRequest): Promise<GetDeploymentResponse> {
    const getDeploymentResponse = this.deploymentClient.getDeployment(request);
    return lastValueFrom(getDeploymentResponse);
  }

  listDeployments(request: ListDeploymentsRequest): Promise<ListDeploymentsResponse> {
    const listDeploymentsResponse = this.deploymentClient.listDeployments(request);
    return lastValueFrom(listDeploymentsResponse);
  }

  deleteDeployment(request: DeleteDeploymentRequest): Promise<DeleteDeploymentResponse> {
    const deleteDeploymentResponse = this.deploymentClient.deleteDeployment(request);
    return lastValueFrom(deleteDeploymentResponse);
  }

  startDeployment(request: StartDeploymentRequest): Promise<StartDeploymentResponse> {
    const startDeploymentResponse = this.deploymentClient.startDeployment(request);
    return lastValueFrom(startDeploymentResponse);
  }

  stopDeployment(request: StopDeploymentRequest): Promise<StopDeploymentResponse> {
    const stopDeploymentResponse = this.deploymentClient.stopDeployment(request);
    return lastValueFrom(stopDeploymentResponse);
  }
}
