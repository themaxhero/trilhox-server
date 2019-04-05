import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Kanban } from "./Kanban";

@Entity("label")
export class Label extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", {length: 20})
    public name: string;

    @Column("varchar", {length: 7})
    public color: string;

    @ManyToOne((type) => Kanban, (kanban) => kanban.labels)
    public kanban!: Kanban;

    constructor(name: string, color: string){
        super();
        this.name = name;
        this.color = color;
    }

    public getKanban(){
        return this.kanban;
    }
}
