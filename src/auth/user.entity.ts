import { Tournament } from '../tournaments/tournament.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(
    (_type) => Tournament,
    (tournament) => tournament.users,
    { eager: false }
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
  tournaments?: Tournament[];
}
