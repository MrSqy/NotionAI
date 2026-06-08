import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

}
