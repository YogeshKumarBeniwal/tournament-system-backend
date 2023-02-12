import { IsNotEmpty, IsNotEmptyObject, IsUUID } from 'class-validator';
import { User } from 'src/auth/user.entity';
import { Tournament } from 'src/tournaments/tournament.entity';

export class CreateParticipantDto {
  @IsNotEmptyObject()
  user: User;

  @IsNotEmptyObject()
  tournament: Tournament;
}

export class RemoveParticipantDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;
}
