import { BaseEntity, Column, Entity, PrimaryGeneratedColumn,
    ManyToOne, CreateDateColumn, Index } from "typeorm";
import Post from './post';
import User from "./user";

@Entity("comment")
export default class Comment extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn() 
    createdAt: Date;

    @Column({ nullable: true })
    content : string;

    @Index()
    @ManyToOne(() => User, (user: User) => user.comment, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    user: string;

    @Index()
    @ManyToOne(() => Post, (post: Post) => post.comment, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    post: string;
};