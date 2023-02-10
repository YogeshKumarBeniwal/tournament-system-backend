import { Tournament } from '../tournaments/tournament.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToMany(
    (_type) => Tournament, 
    (tournament) => tournament.users, 
    { eager: true }
  )
  @JoinTable({
    name: 'participant',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tournamentId',
      referencedColumnName: 'id',
    },
  })
  tournaments: Tournament[];
}
