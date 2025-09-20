import {
  Controller,
  Post,
  Delete,
  Get,
  Req,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from '@nestjs/passport';
import { FollowDto } from './dto/follow.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  follow(@Req() req: any, @Body() dto: FollowDto) {
    return this.followService.follow(req.user.id, dto.followingId);
  }

  @Delete()
  unfollow(@Req() req: any, @Body() dto: FollowDto) {
    return this.followService.unfollow(req.user.id, dto.followingId);
  }

  @Get('followers/:userId')
  getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }
}
