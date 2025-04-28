import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  AuthClient,
  GetUsersRequest,
  GetUsersResponse,
  GetUserByTokenRequest,
  User,
  DeleteUserRequest,
} from 'protos/gen/ts/auth/auth';

@Injectable()
export class UsersService {
  private usersClient: AuthClient;

  constructor(@Inject('USERS_PACKAGE') private client: ClientGrpc) {
    this.usersClient = this.client.getService<AuthClient>('Auth');
  }

  getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    const response = this.usersClient.getUsers(request);
    return lastValueFrom(response);
  }

  getUserByToken(request: GetUserByTokenRequest): Promise<User> {
    const response = this.usersClient.getUserByToken(request);
    return lastValueFrom(response);
  }

  deleteUser(request: DeleteUserRequest): Promise<{}> {
    const response = this.usersClient.deleteUser(request);
    return lastValueFrom(response);
  }
}
