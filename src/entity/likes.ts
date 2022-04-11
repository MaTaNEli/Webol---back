import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Post from './post';
import User from "./user";

@Entity("likes")
export default class Likes extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user: User) => user.like, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    user: string;

    @ManyToOne(() => Post, (post: Post) => post.like, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    post: string;
};