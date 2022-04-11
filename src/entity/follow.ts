import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from './user';

@Entity("follow")
export default class Follow extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user: User) => user.follower, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    follower: string;

    @ManyToOne(() => User, (user: User) => user.follow, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    user: string;
};