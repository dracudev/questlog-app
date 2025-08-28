import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.usersService.findAll(paginationQuery);
  }

  @Get('profile/:username')
  @Public()
  @ApiOperation({ summary: 'Get user profile by username' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(
    @Param('username') username: string,
    @GetUser('id') currentUserId?: string,
  ): Promise<UserProfileDto> {
    return this.usersService.getProfile(username, currentUserId);
  }

  @Get('profile/:username/followers')
  @Public()
  @ApiOperation({ summary: 'Get user followers' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiResponse({ status: 200, description: 'Followers retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFollowers(
    @Param('username') username: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.usersService.getFollowers(username, paginationQuery);
  }

  @Get('profile/:username/following')
  @Public()
  @ApiOperation({ summary: 'Get users that this user follows' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiResponse({ status: 200, description: 'Following list retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFollowing(
    @Param('username') username: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.usersService.getFollowing(username, paginationQuery);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.usersService.updateRole(id, role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
