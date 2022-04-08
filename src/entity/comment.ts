import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Post from './post';

@Entity("comment")
export default class Comment extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'date' })
    createdAt: string;

    @Column({ nullable: true })
    content : string;

    @Column()
    username: string;

    @ManyToOne(() => Post, (post: Post) => post.comment, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    post: Post;
};