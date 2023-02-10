import { IsEnum, IsNotEmpty } from 'class-validator';
// import { GameGenre } from '../game-genre.enum';

export class CreateGameDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  // @IsNotEmpty()
  // @IsEnum(GameGenre)
  // genre: GameGenre;

  @IsNotEmpty()
  icon: string;

  @IsNotEmpty()
  thumbnail: string;
}