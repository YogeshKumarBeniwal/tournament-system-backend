import { IsEnum } from 'class-validator';
import { TournamentStatus } from '../tournament-status.enum';

export class UpdateTournamentStatusDto {
  @IsEnum(TournamentStatus)
  status: TournamentStatus;
}
