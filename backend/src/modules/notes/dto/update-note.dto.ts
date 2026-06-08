import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

}
