import {
  Controller,
  Get,
  Param,
  Body,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/decorators/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateArtistDto } from './dto/artist.dto';
import { Roles } from 'src/common/guards/roles.guard';

@Controller('api/artist')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }

  @Get(':id')
  async getArtist(@Param('id') id: string) {
    return this.artistService.getArtistProfile(id);
  }

  @Roles('artist')
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateArtistDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    console.log(dto)
    return this.artistService.updateArtist(id, dto, files);
  }
}
