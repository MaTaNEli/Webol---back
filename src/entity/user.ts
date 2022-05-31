import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Post from './post';
import Follow from './follow';
import Comment from './comment';
import Like from './likes';
import Message from './messages';
import Notifications from './notifications';

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
    displayUsername: string;

    @Column()
    profileImage: string;

    @Column()
    themeImage: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    isPrivate: boolean;

    @Column({ nullable: true })
    price: number;

    @Column({nullable: true})
    role: string;

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

    @OneToMany(() => Message, (message: Message) => message.sender, {cascade: true})
    messageSend: Array<Message>;

    @OneToMany(() => Notifications, (notifications: Notifications) => notifications.user, {cascade: true})
    notifications: Array<Notifications>;

    @OneToMany(() => Message, (message: Message) => message.recipient , {cascade: true})
    messageRecipient : Array<Message>;
}