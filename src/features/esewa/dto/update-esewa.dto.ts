import { PartialType } from '@nestjs/mapped-types';
import { CreateEsewaDto } from './create-esewa.dto';

export class UpdateEsewaDto extends PartialType(CreateEsewaDto) {}
