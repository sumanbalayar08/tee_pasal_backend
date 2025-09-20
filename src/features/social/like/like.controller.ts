import { Controller, Post, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '@nestjs/passport';
import { DesignDto } from './dto/design.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  like(@Req() req: any, @Body() dto: DesignDto) {
    return this.likeService.like(req.user.id, dto.designId);
  }

  @Delete()
  unlike(@Req() req: any, @Body() dto: DesignDto) {
    return this.likeService.unlike(req.user.id, dto.designId);
  }
}
