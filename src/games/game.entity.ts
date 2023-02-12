import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tournament } from '../tournaments/tournament.entity';

@Entity()
export class Game{
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
  
    @OneToMany((_type) => Tournament, (tournament) => tournament.game, { eager: true })
    tournaments: Tournament[];
}