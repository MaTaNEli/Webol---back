import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("post")
export default class Post extends BaseEntity {
    
    @PrimaryColumn()
    id: string;

    @Column()
    idOfUser: string;

    @Column({ type: 'date' })
    createdAt: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    url: string;
};