import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { GetTournamentsFilterDto } from './dto/get-tournaments-filter.dto';
import { UpdateTournamentStatusDto } from './dto/update-tournament-status.dto';
import { Tournament } from './tournament.entity';
import { TournamentsService } from './tournaments.service';
import { Logger } from '@nestjs/common';

@Controller('tournaments')
// @UseGuards(AuthGuard())
export class TournamentsController {
  private logger = new Logger(TournamentsController.name);

  constructor(private tournamentsService: TournamentsService) { }

  @Get()
  getTournaments(
    @Query() filterDto: GetTournamentsFilterDto,
  ): Promise<Tournament[]> {
    this.logger.verbose(
      `Retrieving all tournaments. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tournamentsService.getTournaments(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Tournament> {
    return this.tournamentsService.getTournamentById(id);
  }

  @Post()
  createTournament(
    @Body() createTournamentDto: CreateTournamentDto
  ): Promise<Tournament> {
    this.logger.verbose(
      `Creating a new tournament. Data: ${JSON.stringify(
        createTournamentDto,
      )}`,
    );
    return this.tournamentsService.createTournament(createTournamentDto);
  }

  @Delete('/:id')
  deleteTournament(@Param('id') id: string): Promise<void> {
    return this.tournamentsService.deleteTournament(id);
  }

  @Patch('/:id/status')
  updateTournamentStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTournamentStatusDto,
  ): Promise<Tournament> {
    this.logger.verbose(
      `Updating a new tournament. Data: ${JSON.stringify(
        updateTaskStatusDto,
      )}`,
    );

    const { status } = updateTaskStatusDto;
    return this.tournamentsService.updateTournamentStatus(id, status);
  }
}
