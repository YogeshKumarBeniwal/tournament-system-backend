import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  icon: string;

  @IsNotEmpty()
  thumbnail: string;
}