import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

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
  @IsInt()
  @IsNumber()
  @Min(2)
  @Max(7)
  maxParticipant: number

  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @Min(1)
  @Max(100)
  scoreToWin: number

  @IsNotEmpty()
  gameId: string;
}
