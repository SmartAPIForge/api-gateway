import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  AuthClient,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateUserRequest,
  ValidateUserResponse,
} from 'protos/gen/ts/auth/auth';

@Injectable()
export class AuthService {
  private authClient: AuthClient;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {
    this.authClient = this.client.getService<AuthClient>('Auth');
  }

  register(request: RegisterRequest): Promise<RegisterResponse> {
    const registerResponse = this.authClient.register(request);
    return lastValueFrom(registerResponse);
  }

  login(request: LoginRequest): Promise<LoginResponse> {
    const loginResponse = this.authClient.login(request);
    return lastValueFrom(loginResponse);
  }

  validateUser(request: ValidateUserRequest): Promise<ValidateUserResponse> {
    const validateResponse = this.authClient.validateUser(request);
    return lastValueFrom(validateResponse);
  }

  refresh(request: RefreshRequest): Promise<RefreshResponse> {
    const refreshResponse = this.authClient.refresh(request);
    return lastValueFrom(refreshResponse);
  }
}
