import {
  IsString,
  IsOptional,
  IsEnum,
  IsUrl,
  ArrayUnique,
  IsNotEmpty,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { DesignCategory, PrintMethod, ProductCategory } from '@prisma/client';
import { Type } from 'class-transformer';

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

  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsEnum(DesignCategory)
  designCategory?: DesignCategory
}

export class UpdateDesignDto extends CreateDesignDto {
  @IsString()
  id: string;
}

export class ProductPublishItem {
  @IsString()
  productCategory: ProductCategory;

  @IsString()
  color: string;
}

export class PublishDesignDto {
  @IsString()
  designId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductPublishItem)
  products: ProductPublishItem[];
}
