import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';

class CreateCommentDto {
  designId: string;
  content: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  comment(@Req() req: any, @Body() dto: CreateCommentDto) {
    return this.commentService.comment(req.user.id, dto.designId, dto.content);
  }

  @Get(':designId')
  getComments(@Param('designId') designId: string) {
    return this.commentService.getComments(designId);
  }
}
