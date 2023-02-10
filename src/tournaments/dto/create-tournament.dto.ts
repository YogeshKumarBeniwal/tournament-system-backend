import { IsNotEmpty } from 'class-validator';

export class CreateTournamentDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  icon: string;

  @IsNotEmpty()
  thumbnail: string;

  @IsNotEmpty()
  gameId: string;
}
