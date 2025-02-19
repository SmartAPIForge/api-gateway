import { Body, Controller, Logger, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  ValidateUserRequest,
} from 'protos/gen/ts/auth/auth';
import { Role, ValidateHeaderDto } from './dto/validateHeaderDto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() request: RegisterRequest) {
    this.logger.log(`Register request: ${JSON.stringify(request)}`);
    return await this.authService.register(request);
  }

  @Post('login')
  async login(@Body() request: LoginRequest) {
    this.logger.log(`Login request: ${JSON.stringify(request)}`);
    return await this.authService.login(request);
  }

  @Post('validate')
  async validateUser(@Headers() headers: ValidateHeaderDto) {
    this.logger.log(`Validate user request: ${JSON.stringify(headers)}`);
    return await this.authService.validateUser({
      accessToken: headers.authorization,
      requiredRole: Role.DEFAULT,
    });
  }

  @Post('refresh')
  async refresh(@Body() req: RefreshRequest) {
    this.logger.log(`Refresh request: ${JSON.stringify(req)}`);
    return await this.authService.refresh({ refreshToken: req.refreshToken });
  }
}
