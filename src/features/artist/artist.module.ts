import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FileUploadService } from 'src/services/spaces/file-upload.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, FileUploadService],
})
export class ArtistModule {}
