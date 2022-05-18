import { BaseEntity, Column, Entity, PrimaryGeneratedColumn,
    ManyToOne, CreateDateColumn, Index, OneToMany } from "typeorm";
import User from "./user";

@Entity("messages")
@Index(["sender", "recipient"])
@Index(["recipient", "read"])
export default class Messages extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn() 
    createdAt: Date;

    @Column()
    read: boolean;

    @Column()
    message: string;

    @Index()
    @ManyToOne(() => User, (user: User) => user.messageSend, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    sender: string;

    @Index()
    @ManyToOne(() => User, (user: User) => user.messageRecipient, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    recipient: string;
};