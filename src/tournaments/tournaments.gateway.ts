import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { AddScoreDto } from './dto/add-score.dto';
import { SocketWithAuth } from './dto/join-tournament.dto';
import { SocketConnectionType } from './socket.room.connection.enum';
import { TournamentStatus } from './tournament-status.enum';
import { Tournament } from './tournament.entity';
import { TournamentsService } from './tournaments.service';

@WebSocketGateway({
  namespace: 'tournaments',
})
export class TournamentsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() io: Namespace;
  private readonly logger = new Logger(TournamentsGateway.name);

  constructor(private readonly tournamentsService: TournamentsService) { }

  async handleConnection(client: SocketWithAuth): Promise<void> {

    const { tournamentId, username, userId } = client;

    this.logger.debug(
      `Socket connected with userID: ${username}, tournamentID: ${tournamentId}`
    );

    let updatedTournament: Tournament;

    try {
      updatedTournament = await this.tournamentsService.addParticipant({
        username,
        tournamentId,
        userId
      });
    }
    catch (error) {
      this.logger.debug(`[addScore] ${error}`);
      client._error({ code: 4001, message: error.message });
      return;
    }

    const roomName = tournamentId;
    await client.join(roomName);

    const clientCount = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    this.logger.debug(
      `user: ${username} joined room with name: ${roomName}`,
    );
    this.logger.debug(
      `Total clients connected to room '${roomName}': ${clientCount}`,
    );

    this.io.to(roomName).emit('tournament_joined', updatedTournament);

    if (updatedTournament.status == TournamentStatus.IN_PROGRESS) {
      this.logger.debug(
        `Tournament started id: ${updatedTournament.id}`
      );
      this.io.to(roomName).emit('tournament_start', updatedTournament);
    }
  }

  async handleDisconnect(client: SocketWithAuth): Promise<void> {
    const { tournamentId, username, userId } = client;
    const sockets = this.io.sockets;
    const roomName = tournamentId;

    client.leave(roomName);

    const clientCount = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    this.logger.debug(`Disconnected socket username: ${username}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.debug(
      `Total clients connected to room '${roomName}': ${clientCount}`,
    );

    let updatedTournament: Tournament;
    try {
      updatedTournament = await this.tournamentsService.removeParticipant({
        username,
        userId,
        tournamentId
      });
    }
    catch (error) {
      this.logger.debug(`[addScore] ${error}`);
      client._error({ code: 4001, message: error.message });
      return;
    }

    this.io.to(roomName).emit('tournament_joined', updatedTournament);
  }

  @SubscribeMessage('add_score')
  async addScore(
    @MessageBody() addScoreDto: AddScoreDto,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {

    const { tournamentId, username, userId } = client;

    this.logger.debug(
      `Attempting to add score for user ${username} to tournament ${tournamentId}`
    );

    let updatedTournament: Tournament;

    try {
      updatedTournament = await this.tournamentsService.addParticipantScore({
        score: addScoreDto.score,
        tournamentId,
        userId
      });
    }
    catch (error) {
      this.logger.debug(`[addScore] ${error}`);
      client._error({ code: 4001, message: error.message });
      return;
    }

    this.io.to(tournamentId).emit('score_updated', { username, score: addScoreDto.score });

    if (updatedTournament.status == TournamentStatus.DONE) {
      this.logger.debug(
        `Tournament ended and the winner is ${username}`,
      );

      this.io.to(tournamentId).emit('tournament_end', {
        tournamentId,
        username
      });
    }
  }
}
