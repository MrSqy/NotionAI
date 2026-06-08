import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChatDto {
  @IsString()
  @IsOptional()
  title?: string;

}
