import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsOptional()
  title?: string;

}
