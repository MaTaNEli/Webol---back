import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Index } from "typeorm";
import User from './user';

@Entity("follow")
export default class Follow extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Index()
    @ManyToOne(() => User, (user: User) => user.follower, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    follower: string;

    @Index()
    @ManyToOne(() => User, (user: User) => user.follow, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    user: string;
};