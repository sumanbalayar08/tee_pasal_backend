import { DesignService } from './design.service';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Param,
  Get,
  Patch,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/guards/roles.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { PublishDesignDto, UpdateDesignDto } from './dto/design.dto';

@Controller('api/design')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DesignController {
  constructor(
    private readonly designService: DesignService,
  ) { }

  @Roles('artist')
  @Post('')
  async createDraft(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.designService.createDraftDesign(userId);
  }

  @Roles('artist')
  @Patch('update')
  @UseInterceptors(FileInterceptor('file'))
  async updateDesign(
    @Body() dto: UpdateDesignDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const userId = (req as any).user.id;
    console.log(dto)
    return this.designService.updateDesign(dto, file, userId);
  }

  @Roles('artist')
  @Post('publish')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'frontImages', maxCount: 10 },
      { name: 'backImages', maxCount: 10 },
    ], {
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      },
    }),
  )
  async publishDesign(
    @UploadedFiles()
    files: {
      frontImages?: Express.Multer.File[];
      backImages?: Express.Multer.File[];
    },
    @Body() body: any, // Parse JSON from form data
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;

    const publishData = JSON.parse(body.data);
    return this.designService.publishDesign(publishData, files, userId);
  }

  @Get('best-sellers')
  async getBestSellers(@Query('limit') limit?: string) {
    const count = limit ? parseInt(limit) : 10;
    return this.designService.getBestSellers(count);
  }

  @Roles('artist')
  @Get('/:id')
  async getDesign(@Param('id') id: string, @Req() req: Request) {
    return this.designService.getDesign(id, (req as any).user.id);
  }
}
