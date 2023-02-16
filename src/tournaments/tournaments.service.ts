import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TournamentStatus } from './tournament-status.enum';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { GetTournamentsFilterDto } from './dto/get-tournaments-filter.dto';
import { TournamentsRepository as TournamentsRepository } from './tournaments.repository';
import { Tournament } from './tournament.entity';
import { GamesService } from 'src/games/games.service';
import { JoinTournamentDto } from './dto/join-tournament.dto';
import { ParticipantsRepository } from './participants/participants.repository';
import { AddParticipantScoreDto } from './dto/add-score.dto';
import { Participant } from './participants/participant.entity';

@Injectable()
export class TournamentsService {
  constructor(
    private tournamentsRepository: TournamentsRepository,
    private gamesService: GamesService,
    private participantsRepository: ParticipantsRepository
  ) { }

  getTournaments(filterDto: GetTournamentsFilterDto): Promise<Tournament[]> {
    return this.tournamentsRepository.getTournaments(filterDto);
  }

  async getTournamentById(id: string): Promise<Tournament> {
    const found = await this.tournamentsRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Tournament with ID "${id}" not found`);
    }

    return found;
  }

  async getLeaderboardByTournamentId(id: string): Promise<Participant[]> {
    const found = await this.getTournamentById( id );

    if (!found) {
      throw new NotFoundException(`Tournament with ID "${id}" not found`);
    }

    return this.participantsRepository.getLeaderboardByTournamentId(id);
  }

  async createTournament(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const game = await this.gamesService.getGameById(createTournamentDto.gameId);
    return this.tournamentsRepository.createTournament(createTournamentDto, game);
  }

  async deleteTournament(id: string): Promise<void> {
    const result = await this.tournamentsRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Tournaments with ID "${id}" not found`);
    }
  }

  async updateTournamentStatus(
    id: string,
    status: TournamentStatus
  ): Promise<Tournament> {
    const tournament = await this.getTournamentById(id);

    if (status && tournament.status != TournamentStatus.DONE)
      tournament.status = status;

    return this.tournamentsRepository.save(tournament);;
  }

  async addParticipant(joinTournamentDto: JoinTournamentDto): Promise<Tournament> {
    const { tournamentId, userId } = joinTournamentDto;

    const tournament = await this.getTournamentById(tournamentId);

    if (tournament.status !== TournamentStatus.OPEN) {
      throw new HttpException('Tournament is closed or in progress!', HttpStatus.FORBIDDEN);
    }

    await this.participantsRepository.createParticipant({
      userId,
      tournamentId
    });

    const UpdatedTournament = await this.getTournamentById(tournamentId);

    if (UpdatedTournament.users.length >= tournament.maxParticipant) {
      return this.updateTournamentStatus(tournamentId, TournamentStatus.IN_PROGRESS);
    }

    return UpdatedTournament;
  }

  async removeParticipant(joinTournamentDto: JoinTournamentDto): Promise<Tournament> {
    const { tournamentId, userId } = joinTournamentDto;

    const tournament = await this.getTournamentById(tournamentId);

    if (tournament.status !== TournamentStatus.OPEN) {
      throw new HttpException('Tournament is closed or in progress!', HttpStatus.FORBIDDEN);
    }

    try {
      await this.participantsRepository.removeParticipant({
        userId,
        tournamentId
      });
    } catch (error) {
      console.error(error);
      return error;
    }

    return this.getTournamentById(tournamentId);
  }

  async addParticipantScore(addParticipantScoreDto: AddParticipantScoreDto): Promise<Tournament> {
    const { tournamentId } = addParticipantScoreDto;
    const tournament = await this.getTournamentById(tournamentId);

    if (tournament.status !== TournamentStatus.IN_PROGRESS) {
      throw new HttpException('Tournament is not started or already closed!', HttpStatus.FORBIDDEN);
    }

    const participent = await this.participantsRepository.addParticipantScore(addParticipantScoreDto);

    if (participent.score >= tournament.scoreToWin) {
      return this.updateTournamentStatus(tournamentId, TournamentStatus.DONE);
    }

    return tournament;
  }
}
