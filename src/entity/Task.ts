import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Card } from "./Card";

@Entity()
export class Task extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", {length: 20})
    public name: string;

    @ManyToOne((type) => Card, (card) => card.tasks)
    public card!: Card;

    @Column("boolean")
    public active: boolean;

    constructor(name: string, active?: boolean){
        super();
        this.name = name || "";
        this.active = active || false;
    }

    public getKanban(){
        return this.card.getKanban();
    }
}
