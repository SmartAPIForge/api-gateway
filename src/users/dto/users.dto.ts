import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/dto/validateHeaderDto';

export class GetUsersRequestDto {
  @ApiProperty({ required: false, description: 'Filter users by name starting with' })
  nameStartsWith?: string;

  @ApiProperty({ required: false, description: 'Filter users by role ID' })
  roleId?: number;
}

export class DeleteUserRequestDto {
  @ApiProperty({ description: 'Username of the user to delete' })
  username: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ enum: Role, enumName: 'Role', example: 1, description: 'User role: 1 - ADMIN, 2 - DEFAULT' })
  role: Role;

  @ApiProperty({ description: 'User email' })
  email: string;
}

export class UsersListResponseDto {
  @ApiProperty({ type: [UserResponseDto], description: 'List of users' })
  users: UserResponseDto[];

  @ApiProperty({ description: 'Total count of users' })
  total: number;
} 