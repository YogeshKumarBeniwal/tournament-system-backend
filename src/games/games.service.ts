import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGameDto } from './dto/creat-game.dto';
import { Game } from './game.entity';
import { GameRepository } from './games.repository';
import { GetGameFilterDto } from './get-game-filter.dto';

@Injectable()
export class GamesService {

    constructor(
        private gameRepository : GameRepository
    ){}

    getGames(filterDto: GetGameFilterDto) : Promise<Game[]>{
        return this.gameRepository.getGames(filterDto);
    }

    async getGameById(id: string): Promise<Game> {
        const found = await this.gameRepository.findOne({ where: {id} });
    
        if (!found) {
          throw new NotFoundException(`Game with ID "${id}" not found`);
        }
    
        return found;
      }

    createGame(createGameDto: CreateGameDto) : Promise<Game>{
        return this.gameRepository.createGame(createGameDto);
    }
}
