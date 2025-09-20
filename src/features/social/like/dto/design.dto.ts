import { IsString } from 'class-validator';

export class DesignDto {
  @IsString()
  designId: string;
}
