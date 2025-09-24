import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FollowingService } from './following.service';
import { RolesGuard } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/guards/roles.guard';

@Controller('api/follow')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FollowingController {
  constructor(private readonly followingService: FollowingService) { }

  @Post(':id')
  @Roles('artist', 'customer')
  async toggleFollow(@Param('id') artistId: string, @Body('userId') userId: string) {
    return this.followingService.toggleFollow(userId, artistId);
  }
}
