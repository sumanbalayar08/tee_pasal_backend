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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateDesignDto } from './dto/design.dto';

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
    return this.designService.updateDesign(dto, file, userId);
  }

  @Roles('artist')
  @Get('/:id')
  async getDesign(@Param('id') id: string, @Req() req: Request) {
    return this.designService.getDesign(id, (req as any).user.id);
  }
}
