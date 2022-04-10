import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import Post from './post';

@Entity("comment")
export default class Comment extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn() 
    createdAt: Date;

    @Column({ nullable: true })
    content : string;

    @Column()
    username: string;

    @ManyToOne(() => Post, (post: Post) => post.comment, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    post: Post;
};