import { IsNotEmpty, IsUUID } from 'class-validator';
import { Socket } from 'socket.io';

export class JoinTournamentDto {
  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;
  
  @IsNotEmpty()
  @IsUUID()
  userId: string;
  
  @IsNotEmpty()
  username: string;
}

export type SocketWithAuth = Socket & JoinTournamentDto;