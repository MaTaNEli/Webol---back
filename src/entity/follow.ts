import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from './user';

@Entity("follow")
export default class Follow extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    follower: string;

    @Column()
    followesAfter: string;

    @ManyToOne(() => User, (user: User) => user.follow, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    user: string;
};