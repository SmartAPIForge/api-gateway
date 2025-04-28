import { Controller, Logger, Headers, Get, Delete, Query, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role, ValidateHeaderDto } from '../auth/dto/validateHeaderDto';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { RequiredRole } from '../auth/required-role.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { GetUsersRequestDto, DeleteUserRequestDto, UserResponseDto, UsersListResponseDto } from './dto/users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequiredRole(Role.ADMIN)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, description: 'List of users', type: UsersListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUsers(
    @Query() query: GetUsersRequestDto
  ): Promise<UsersListResponseDto> {
    this.logger.log(`Get users request with filters: nameStartsWith=${query.nameStartsWith}, roleId=${query.roleId}`);
    const users = await this.usersService.getUsers({
      RoleId: query.roleId || Role.DEFAULT,
      NameStartsWith: query.nameStartsWith || '',
    });
    return {
      users: users.users.map(user => ({
        username: user.Username,
        role: user.RoleId,
        email: user.Email
      })),
      total: users.users.length
    }
  }

  @Get('me')
  @RequiredRole(Role.DEFAULT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user by token (default role)' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, description: 'User information', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserByToken(@Headers() headers: ValidateHeaderDto): Promise<UserResponseDto> {
    this.logger.log('Get user by token request');
    const user = await this.usersService.getUserByToken({
      AccessToken: headers.authorization,
    });
    return {
      username: user.Username,
      role: user.RoleId,
      email: user.Email
    };
  }

  @Delete()
  @RequiredRole(Role.ADMIN)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user by username (admin only)' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteUser(@Body() body: DeleteUserRequestDto): Promise<{}> {
    this.logger.log(`Delete user request for username: ${body.username}`);
    return await this.usersService.deleteUser({
      Username: body.username,
    });
  }
}
