import { IsEnum, IsNotEmpty, Min } from 'class-validator';
import { SocketConnectionType } from '../socket.room.connection.enum';

export class AddParticipantResponseDto {
  @IsNotEmpty()
  username: string;

  @Min(1)
  userCount: number;
  
  @IsEnum(SocketConnectionType)
  type: SocketConnectionType
}