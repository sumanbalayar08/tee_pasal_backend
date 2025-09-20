import {
  IsString,
  IsOptional,
  IsEnum,
  IsUrl,
  ArrayUnique,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { DesignCategory, PrintMethod } from '@prisma/client';

export class UploadDesignFileDto {
  @IsNotEmpty()
  file: Express.Multer.File;
}

export class CreateDesignDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(PrintMethod)
  printMethod?: PrintMethod;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  tags?: string[];

  @IsOptional()
  @IsEnum(DesignCategory)
  designCategory?: DesignCategory
}

export class UpdateDesignDto extends CreateDesignDto {
  @IsString()
  id: string;
}
