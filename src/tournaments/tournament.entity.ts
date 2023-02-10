import { Exclude } from 'class-transformer';
import { Game } from '../games/game.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TournamentStatus } from './tournament-status.enum';
import { User } from 'src/auth/user.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  icon: string;

  @Column()
  thumbnail: string;

  @Column()
  status: TournamentStatus;

  @ManyToOne((_type) => Game, (game) => game.tournaments, { eager: false })
  @Exclude({ toPlainOnly: true })
  game: Game;

  @ManyToOne((_type) => User, (user) => user.tournaments )
  users: User[];
}
