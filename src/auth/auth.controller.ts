import { Body, Controller, Logger, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
} from 'protos/gen/ts/auth/auth';
import { Role, ValidateHeaderDto } from './dto/validateHeaderDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { 
  RegisterRequestDto, 
  LoginRequestDto, 
  RefreshRequestDto,
  AuthResponseDto,
  ValidateResponseDto,
  RegisterResponseDto
} from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: RegisterResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @Post('register')
  async register(@Body() request: RegisterRequest): Promise<RegisterResponseDto> {
    this.logger.log(`Register request: ${JSON.stringify(request)}`);
    return await this.authService.register(request);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @Post('login')
  async login(@Body() request: LoginRequest): Promise<AuthResponseDto> {
    this.logger.log(`Login request: ${JSON.stringify(request)}`);
    return await this.authService.login(request);
  }

  @ApiResponse({ 
    status: 200, 
    description: 'Token validation result',
    type: ValidateResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @Post('validate')
  async validateUser(@Headers() headers: ValidateHeaderDto): Promise<ValidateResponseDto> {
    this.logger.log(`Validate user request: ${JSON.stringify(headers)}`);
    return await this.authService.validateUser({
      accessToken: headers.authorization,
      requiredRole: Role.DEFAULT,
    });
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Token successfully refreshed',
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid refresh token' })
  @Post('refresh')
  async refresh(@Body() req: RefreshRequest): Promise<AuthResponseDto> {
    this.logger.log(`Refresh request: ${JSON.stringify(req)}`);
    return await this.authService.refresh({ refreshToken: req.refreshToken });
  }
}
