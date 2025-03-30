import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User password' })
  password: string;
}

export class LoginRequestDto {
  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User password' })
  password: string;
}

export class RefreshRequestDto {
  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;
}

export class ValidateResponseDto {
  @ApiProperty({ description: 'Whether the token is valid' })
  isValid: boolean;

  @ApiProperty({ description: 'User ID if token is valid', required: false })
  userId?: string;
} 