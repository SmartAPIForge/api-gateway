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
}
