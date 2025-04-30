import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { REQUIRED_ROLE_KEY } from './required-role.decorator';
import { Role } from './dto/validateHeaderDto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true
    const request = context.switchToHttp().getRequest();
    return this.authService
      .validateUser({
        accessToken: request.headers.authorization,
        requiredRole:
          this.reflector.get<number>(REQUIRED_ROLE_KEY, context.getHandler()) ||
          Role.DEFAULT,
      })
      .then((response) => {
        return response?.valid;
      });
  }
}
