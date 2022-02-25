import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from './user';

@Entity("post")
export default class Post extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'date' })
    createdAt: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    url: string;

    @ManyToOne(() => User, (user: User) => user.post)
    user: User;
};