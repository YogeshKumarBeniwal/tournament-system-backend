import { IsIn, IsNotEmpty, IsNotEmptyObject, IsNumber, IsUUID } from "class-validator";

export class AddScoreDto{
    @IsNumber()
    @IsIn([1])
    score: number;
}

export class AddParticipantScoreDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;

  @IsNumber()
  @IsIn([1])
  score: number;
}