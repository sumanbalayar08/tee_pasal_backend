import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/guards/roles.guard';

@Controller('artist')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }


}
