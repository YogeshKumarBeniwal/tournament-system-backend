import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Game } from './game.entity';
import { GamesController } from './games.controller';
import { GameRepository } from './games.repository';
import { GamesService } from './games.service';

@Module({
    imports: [TypeOrmModule.forFeature([Game]), AuthModule],
    controllers: [GamesController],
    providers: [GamesService, GameRepository],
    exports: [GamesService]
})
export class GamesModule { }
