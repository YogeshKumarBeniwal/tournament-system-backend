import { IsEnum, IsOptional, IsString } from 'class-validator';
// import { GameGenre } from './game-genre.enum';

export class GetGameFilterDto {
  // @IsOptional()
  // @IsEnum(GameGenre)
  // genre?: GameGenre;

  @IsOptional()
  @IsString()
  search?: string;
}