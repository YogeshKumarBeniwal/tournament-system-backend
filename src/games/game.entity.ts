import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tournament } from '../tournaments/tournament.entity';
// import { GameGenre } from "./game-genre.enum";

@Entity()
export class Game{
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    title: string;
  
    @Column()
    description: string;

    // @Column()
    // genre: GameGenre;

    @Column()
    icon: string;

    @Column()
    thumbnail: string;
  
    @OneToMany((_type) => Tournament, (tournament) => tournament.game, { eager: true })
    tournaments: Tournament[];
}