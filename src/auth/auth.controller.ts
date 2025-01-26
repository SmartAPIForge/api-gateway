import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  RegisterRequest,
  ValidateUserRequest,
} from 'protos/gen/ts/auth/auth';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() request: RegisterRequest) {
    this.logger.log(`Register request: ${JSON.stringify(request)}`);
    return this.authService.register(request);
  }

  @Post('login')
  async login(
    @Body() request: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(`Login request: ${JSON.stringify(request)}`);
    const { accessToken, refreshToken } = await this.authService.login(request);
    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return { token: accessToken };
  }

  @Post('validate')
  validateUser(@Body() request: ValidateUserRequest) {
    this.logger.log(`Validate user request: ${JSON.stringify(request)}`);
    return this.authService.validateUser(request);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(`Refresh request: ${JSON.stringify(req.body)}`);
    const { refreshToken: oldRefreshToken } = req.cookies;
    const { accessToken, refreshToken: updatedRefreshToken } =
      await this.authService.refresh({ refreshToken: oldRefreshToken });
    res.cookie('refreshToken', updatedRefreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return { token: accessToken };
  }
}
