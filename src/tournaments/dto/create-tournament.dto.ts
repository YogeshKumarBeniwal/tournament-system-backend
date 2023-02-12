import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateTournamentDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  icon: string;

  @IsNotEmpty()
  thumbnail: string;

  @IsNumber()
  @Min(2)
  @Max(7)
  maxParticipant: number

  @IsNumber()
  @Min(1)
  @Max(100)
  scoreToWin: number

  @IsNotEmpty()
  gameId: string;
}
