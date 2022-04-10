import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import User from './user';
import Comment from './comment'
import Likes from "./likes";

@Entity("post")
export default class Post extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn() 
    createdAt: Date;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    url: string;

    @ManyToOne(() => User, (user: User) => user.post, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    user: User;

    @OneToMany(() => Comment, (comment: Comment) => comment.post, {cascade: true})
    comment: Array<Comment>;

    @OneToMany(() =>Likes, (like: Likes) => like.post, {cascade: true})
    like: Array<Likes>;
};