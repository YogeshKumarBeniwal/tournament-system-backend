import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CreateGameDto } from "./dto/creat-game.dto";
import { Game } from "./game.entity";
import { GetGameFilterDto } from "./get-game-filter.dto";

@Injectable()
export class GameRepository extends Repository<Game>{
    private logger = new Logger(GameRepository.name, { timestamp: true });

    constructor(private dataSource: DataSource) {
        super(Game, dataSource.createEntityManager());
    }

    async getGames(filterDto: GetGameFilterDto): Promise<Game[]> {
        const { search } = filterDto;

        const query = this.createQueryBuilder('game');

        if (search) {
            query.andWhere(
                '(LOWER(game.title) LIKE LOWER(:search) OR LOWER(game.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }

        try {
            const games = await query.getMany();
            return games;
        } catch (error) {
            this.logger.error(
                `Failed to get game. Filters: ${JSON.stringify(filterDto)}`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }

    async createGame(createGameDto: CreateGameDto): Promise<Game> {
        const { title, description, icon, thumbnail } = createGameDto;

        const game = this.create({
            title,
            description,
            icon,
            thumbnail
        });

        return this.save(game);
    }
}