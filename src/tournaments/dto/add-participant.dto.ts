import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddParticipantDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;
}
