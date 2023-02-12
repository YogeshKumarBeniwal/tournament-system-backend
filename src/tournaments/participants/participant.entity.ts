import { User } from "../../auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Tournament } from "../tournament.entity";

@Entity()
export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @PrimaryColumn()
    userId: string;

    @ManyToOne(_type => User, user => user.tournaments)
    @JoinColumn([{ referencedColumnName: 'id' }])
    user: User;

    @PrimaryColumn()
    tournamentId: string;

    @ManyToOne(_type => Tournament, tournament => tournament.users)
    @JoinColumn([{ referencedColumnName: 'id' }])
    tournament: Tournament;

    @Column({ default: 0 })
    score: number;
} 