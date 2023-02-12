import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinTournamentResponseDto {
  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;
}