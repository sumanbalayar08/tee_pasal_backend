import { Module } from '@nestjs/common';
import { EsewaService } from './esewa.service';
import { EsewaController } from './esewa.controller';

@Module({
  controllers: [EsewaController],
  providers: [EsewaService],
})
export class EsewaModule {}
