import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from '../games/games.module';
import { AuthModule } from '../auth/auth.module';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { Tournament } from './tournament.entity';
import { TournamentsRepository } from './tournaments.repository';
import { Game } from 'src/games/game.entity';
import { TournamentsGateway } from './tournaments.gateway';
import { ParticipantsRepository } from './participants/participants.repository';
import { Participant } from './participants/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Game, Participant]), AuthModule, GamesModule],
  controllers: [TournamentsController],
  providers: [ParticipantsRepository, TournamentsService, TournamentsRepository, TournamentsGateway, TournamentsGateway],
})
export class TournamentsModule {}
