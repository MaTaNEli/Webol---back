import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
};