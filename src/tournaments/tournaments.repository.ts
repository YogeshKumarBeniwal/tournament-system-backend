import { DataSource, Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { GetTournamentsFilterDto } from './dto/get-tournaments-filter.dto';
import { TournamentStatus } from './tournament-status.enum';
import { Tournament } from './tournament.entity';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Game } from 'src/games/game.entity';

@Injectable()
export class TournamentsRepository extends Repository<Tournament> {
  private logger = new Logger('TournamentsRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Tournament, dataSource.createEntityManager());
  }

  async getTournaments(filterDto: GetTournamentsFilterDto): Promise<Tournament[]> {
    const { status, gameId, search } = filterDto;

    const query = this.createQueryBuilder('tournament');

    if (gameId) {
      query.andWhere('tournament.gameId = :gameId', { gameId });
    }

    if (status) {
      query.andWhere('tournament.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(tournament.title) LIKE LOWER(:search) OR LOWER(tournament.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tournaments = await query.getMany();
      return tournaments;
    } catch (error) {
      this.logger.error(
        `Failed to get tournament. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTournament(createTaskDto: CreateTournamentDto, game: Game): Promise<Tournament> {
    const { title, description, icon, thumbnail } = createTaskDto;

    const tournament = this.create({
      title,
      description,
      icon,
      thumbnail,
      game,
      status: TournamentStatus.OPEN,
    });

    await this.save(tournament);
    return tournament;
  }
}
