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
  valid: boolean;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken: string;
}

export class RegisterResponseDto {
  @ApiProperty({ description: 'User ID' })
  userId: number;
} 