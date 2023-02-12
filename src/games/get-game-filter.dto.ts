import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetGameFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}