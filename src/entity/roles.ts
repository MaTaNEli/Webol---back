import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

@Entity("roles")
export default class Roles extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;
};