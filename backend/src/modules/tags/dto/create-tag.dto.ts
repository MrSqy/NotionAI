import { IsString, IsOptional, MaxLength, IsHexColor } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string;
}
