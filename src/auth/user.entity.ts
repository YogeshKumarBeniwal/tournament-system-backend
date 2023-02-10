import { Tournament } from '../tournaments/tournament.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // @OneToMany((_type) => Tournament, (tournament) => tournament.game, { eager: true })
  // tournaments: Tournament[];
}
