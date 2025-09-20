import { Controller, Post, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { SaveService } from './save.service';
import { AuthGuard } from '@nestjs/passport';
import { DesignDto } from '../like/dto/design.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('saves')
export class SaveController {
  constructor(private readonly saveService: SaveService) {}

  @Post()
  save(@Req() req: any, @Body() dto: DesignDto) {
    return this.saveService.save(req.user.id, dto.designId);
  }

  @Delete()
  unsave(@Req() req: any, @Body() dto: DesignDto) {
    return this.saveService.unsave(req.user.id, dto.designId);
  }
}
