import { Module } from '@nestjs/common';
import { DesignService } from './design.service';
import { FileUploadService } from 'src/services/spaces/file-upload.service';
import { DesignController } from './design.controller';

@Module({
  controllers: [DesignController],
  providers: [DesignService, FileUploadService],
})
export class DesignModule {}
