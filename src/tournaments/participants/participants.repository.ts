import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AddParticipantScoreDto } from "../dto/add-score.dto";
import { CreateParticipantDto, RemoveParticipantDto } from "../dto/create-participant-dto";
import { Participant } from "./participant.entity";

@Injectable()
export class ParticipantsRepository extends Repository<Participant> {
  private logger = new Logger(ParticipantsRepository.name, { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Participant, dataSource.createEntityManager());
  }

  async createParticipant(createTournamentDto: CreateParticipantDto): Promise<Participant> {
    const { userId, tournamentId } = createTournamentDto;

    const participant = this.create({
      userId,
      tournamentId
    });

    return this.save(participant);
  }
  
  async removeParticipant(removeParticipantDto: RemoveParticipantDto): Promise<void> {
    const { userId, tournamentId } = removeParticipantDto;

    const result = await this.delete({
      userId,
      tournamentId
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Participant with userID ${userId} not part of tournament ${tournamentId}`);
    }
  }

  async addParticipantScore(addParticipantScoreDto: AddParticipantScoreDto): Promise<Participant> {
    const {userId, tournamentId, score } = addParticipantScoreDto;

    const participant = await this.findOne({
      where: {
        userId,
        tournamentId
      }
    });

    participant.score += score;

    return this.save(participant);;
  }

  async getLeaderboardByTournamentId(tournamentId: string): Promise<Participant[]> {
    const participants = await this.createQueryBuilder("participant")
      .leftJoinAndSelect("participant.tournament", "tournament")
      .leftJoinAndSelect("participant.user", "user")
      .where("participant.tournamentId = :tournamentId", { tournamentId })
      .orderBy("participant.score", "DESC")
      .cache(10) // set the TTL to 10 seconds
      .getMany();

    return participants;
  }
}
