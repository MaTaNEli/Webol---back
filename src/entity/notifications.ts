import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Index, ManyToOne } from "typeorm";
import User from "./user";

@Entity("notifications")
@Index(["userConnect", "read"])
export default class Notification extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    message : string;

    @Column()
    read: boolean;

    @Column({ nullable: true })
    postId: string;

    @Index()
    @Column()
    userConnect : string;

    @Index()
    @ManyToOne(() => User, (user: User) => user.notifications, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    user : string;
};