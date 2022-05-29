import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("categories")
export default class Categories extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;
};