import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TournamentStatus } from '../tournament-status.enum';

export class GetTournamentsFilterDto {
  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus;

  @IsOptional()
  @IsString()
  gameId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
