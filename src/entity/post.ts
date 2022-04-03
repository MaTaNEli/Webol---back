import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import User from './user';
import Comment from './comment'

@Entity("post")
export default class Post extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'date' })
    createdAt: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    url: string;

    @ManyToOne(() => User, (user: User) => user.post, {onDelete: "CASCADE"})
    user: User;

    @OneToMany(() => Comment, (comment: Comment) => comment.post, {cascade: true})
    comment: Array<Comment>;
};