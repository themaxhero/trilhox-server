import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Card } from "./Card";
import { Kanban } from "./Kanban";

@Entity("book")
export class Book extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", {length: 20})
    public name: string;

    @ManyToOne((type) => Kanban, (kanban) => kanban.books)
    public kanban!: Kanban;

    @OneToMany((type) => Card, (card) => card.book)
    public cards!: Card[];

    constructor(name?: string){
        super();
        this.name = name || "Untitled Book";
    }

    public getKanban(){
        return this.kanban;
    }
}
