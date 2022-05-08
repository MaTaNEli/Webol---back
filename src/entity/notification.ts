import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("notification")
@Index(["userId", "read"])
export default class Notification extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    message : string;

    @Column()
    read: boolean;

    @Column({ nullable: true })
    postId: string;

    @Column()
    profileImage: string;

    @Column()
    user: string;

    @Index()
    @Column()
    userId : string;
};