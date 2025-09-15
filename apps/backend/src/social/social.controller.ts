import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards';
import { GetUser } from '@/auth/decorators';
import { SocialService } from './social.service';
import { ActivityFeedQueryDto, ActivityFeedResponseDto, SocialStatsDto } from './dto';

@ApiTags('Social')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('follow/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({ name: 'userId', description: 'ID of user to follow' })
  @ApiResponse({ status: 204, description: 'User followed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Already following this user' })
  async followUser(
    @GetUser('id') currentUserId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.socialService.followUser(currentUserId, userId);
  }

  @Delete('follow/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({ name: 'userId', description: 'ID of user to unfollow' })
  @ApiResponse({ status: 204, description: 'User unfollowed successfully' })
  @ApiResponse({ status: 400, description: 'Not following this user' })
  async unfollowUser(
    @GetUser('id') currentUserId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.socialService.unfollowUser(currentUserId, userId);
  }

  @Get('following/:userId')
  @ApiOperation({ summary: 'Check if following a user' })
  @ApiParam({ name: 'userId', description: 'ID of user to check' })
  @ApiResponse({
    status: 200,
    description: 'Following status',
    schema: {
      type: 'object',
      properties: {
        isFollowing: { type: 'boolean' },
      },
    },
  })
  async isFollowing(
    @GetUser('id') currentUserId: string,
    @Param('userId') userId: string,
  ): Promise<{ isFollowing: boolean }> {
    const isFollowing = await this.socialService.isFollowing(currentUserId, userId);
    return { isFollowing };
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get activity feed' })
  @ApiResponse({
    status: 200,
    description: 'Activity feed retrieved successfully',
    type: ActivityFeedResponseDto,
  })
  async getActivityFeed(
    @GetUser('id') currentUserId: string,
    @Query() query: ActivityFeedQueryDto,
  ): Promise<ActivityFeedResponseDto> {
    return this.socialService.getActivityFeed(currentUserId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get current user social stats' })
  @ApiResponse({
    status: 200,
    description: 'Social stats retrieved successfully',
    type: SocialStatsDto,
  })
  async getSocialStats(@GetUser('id') currentUserId: string): Promise<SocialStatsDto> {
    return this.socialService.getSocialStats(currentUserId);
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Get user social stats' })
  @ApiParam({ name: 'userId', description: 'ID of user to get stats for' })
  @ApiResponse({
    status: 200,
    description: 'Social stats retrieved successfully',
    type: SocialStatsDto,
  })
  async getUserSocialStats(@Param('userId') userId: string): Promise<SocialStatsDto> {
    return this.socialService.getSocialStats(userId);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get follow suggestions' })
  @ApiResponse({
    status: 200,
    description: 'Follow suggestions retrieved successfully',
  })
  async getFollowSuggestions(
    @GetUser('id') currentUserId: string,
    @Query('limit') limit?: number,
  ): Promise<any[]> {
    return this.socialService.getFollowSuggestions(currentUserId, limit);
  }

  @Get('mutual/:userId')
  @ApiOperation({ summary: 'Get mutual follows with another user' })
  @ApiParam({ name: 'userId', description: 'ID of user to check mutual follows with' })
  @ApiResponse({
    status: 200,
    description: 'Mutual follows retrieved successfully',
  })
  async getMutualFollows(
    @GetUser('id') currentUserId: string,
    @Param('userId') userId: string,
  ): Promise<{ mutualFollows: string[] }> {
    const mutualFollows = await this.socialService.getMutualFollows(currentUserId, userId);
    return { mutualFollows };
  }
}
