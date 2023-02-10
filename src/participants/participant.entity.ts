import { User } from "../auth/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tournament } from "../tournaments/tournament.entity";

@Entity()
export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(_type => User, user => user.tournaments)
    @JoinColumn([{ referencedColumnName: 'id' }])
    user: User;
  
    @ManyToOne(_type => Tournament, tournament => tournament.users)
    @JoinColumn([{ referencedColumnName: 'id' }])
    tournament: Tournament;
} 