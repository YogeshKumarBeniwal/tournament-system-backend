import { Body, Controller, Post } from '@nestjs/common';
import { Get, Query } from '@nestjs/common/decorators';
import { CreateGameDto } from './dto/creat-game.dto';
import { Game } from './game.entity';
import { GamesService } from './games.service';
import { GetGameFilterDto } from './get-game-filter.dto';

@Controller('games')
export class GamesController {

    constructor(private gamesService: GamesService) { }

    @Get()
    GetGames(
        @Query() filterDto: GetGameFilterDto,
    ): Promise<Game[]> {
        return this.gamesService.getGames(filterDto);
    }

    @Post()
    CreateGame(
        @Body() createGameDto: CreateGameDto
    ): Promise<Game> {
        return this.gamesService.createGame(createGameDto);
    }
}
