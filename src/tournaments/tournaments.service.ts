import { Injectable, NotFoundException } from '@nestjs/common';
import { TournamentStatus } from './tournament-status.enum';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { GetTournamentsFilterDto } from './dto/get-tournaments-filter.dto';
import { TournamentsRepository as TournamentsRepository } from './tournaments.repository';
import { Tournament } from './tournament.entity';
import { User } from '../auth/user.entity';
import { GamesService } from 'src/games/games.service';

@Injectable()
export class TournamentsService {
  constructor(
    private tournamentsRepository: TournamentsRepository,
    private gamesService: GamesService
  ) { }

  getTournaments(filterDto: GetTournamentsFilterDto): Promise<Tournament[]> {
    return this.tournamentsRepository.getTournaments(filterDto);
  }

  async getTournamentById(id: string): Promise<Tournament> {
    const found = await this.tournamentsRepository.findOne({ 
      where: { 
        id
      } 
    });

    if (!found) {
      throw new NotFoundException(`Tournament with ID "${id}" not found`);
    }

    return found;
  }

  async createTournament(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const game = await this.gamesService.getGameById(createTournamentDto.gameId);
    return this.tournamentsRepository.createTournament(createTournamentDto, game);
  }

  async deleteTournament(id: string, user: User): Promise<void> {
    const result = await this.tournamentsRepository.delete({ id, game: user });

    if (result.affected === 0) {
      throw new NotFoundException(`Tournaments with ID "${id}" not found`);
    }
  }

  async updateTournamentStatus(
    id: string,
    status: TournamentStatus,
    user: User,
  ): Promise<Tournament> {
    const tournament = await this.getTournamentById(id);

    tournament.status = status;
    await this.tournamentsRepository.save(tournament);

    return tournament;
  }
}
