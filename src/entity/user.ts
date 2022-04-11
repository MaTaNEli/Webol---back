import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Post from './post';
import Follow from './follow';
import Comment from './comment';
import Like from './likes';


@Entity("users")
export default class User extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    profileImage: string;

    @Column()
    themeImage: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    role: string;

    @Column()
    media: number;

    @Column({ nullable: true })
    bio: string;

    @OneToMany(() => Post, (post: Post) => post.user, {cascade: true})
    post: Array<Post>;

    @OneToMany(() => Follow, (follow: Follow) => follow.user, {cascade: true})
    follow: Array<Follow>;

    @OneToMany(() => Follow, (follow: Follow) => follow.follower, {cascade: true})
    follower: Array<Follow>;

    @OneToMany(() => Comment, (comment: Comment) => comment.user, {cascade: true})
    comment: Array<Comment>;

    @OneToMany(() => Like, (like: Like) => like.user, {cascade: true})
    like: Array<Like>;
}