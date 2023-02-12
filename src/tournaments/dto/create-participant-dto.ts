import { IsNotEmpty, IsNotEmptyObject, IsUUID } from 'class-validator';
import { User } from 'src/auth/user.entity';
import { Tournament } from 'src/tournaments/tournament.entity';

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;
}

export class RemoveParticipantDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;
}
