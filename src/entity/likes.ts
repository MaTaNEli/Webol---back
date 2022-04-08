import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Post from './post';

@Entity("likes")
export default class Likes extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    username: string;

    @ManyToOne(() => Post, (post: Post) => post.like, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    post: string;
};