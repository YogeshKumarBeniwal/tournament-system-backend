import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from '../games/games.module';
import { AuthModule } from '../auth/auth.module';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { Tournament } from './tournament.entity';
import { TournamentsRepository } from './tournaments.repository';
import { Game } from 'src/games/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Game]), AuthModule, GamesModule],
  controllers: [TournamentsController],
  providers: [TournamentsService, TournamentsRepository],
})
export class TournamentsModule {}
