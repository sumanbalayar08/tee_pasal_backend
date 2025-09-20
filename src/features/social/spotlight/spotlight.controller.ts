import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { SpotlightService } from './spotlight.service';
import { AuthGuard } from '@nestjs/passport';

class CreateSpotlightDto {
  content: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('spotlights')
export class SpotlightController {
  constructor(private readonly spotlightService: SpotlightService) {}

  @Post()
  createSpotlight(@Req() req: any, @Body() dto: CreateSpotlightDto) {
    return this.spotlightService.create(req.user.id, dto.content);
  }

  @Get()
  getActiveSpotlights() {
    return this.spotlightService.getActiveSpotlights();
  }
}
