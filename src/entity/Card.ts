import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./Book";
import { Comment } from "./Comment";
import { Label } from "./Label";
import { Task } from "./Task";

@Entity("card")
export class Card extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", {length: 20})
    public name: string;

    @Column("varchar", {length: 1024})
    public description!: string;

    @OneToMany((type) => Task, (task) => task.card)
    public tasks!: Task[];

    @ManyToMany((type) => Label)
    @JoinTable()
    public labels!: Label[];

    @ManyToOne((type) => Book, (book) => book.cards)
    public book!: Book;

    @OneToMany((type) => Comment, (comment) => comment.card)
    public comments!: Comment[];

    constructor(name?: string){
        super();
        this.name = name || "Untitled Card";
    }

    public getKanban(){
        return this.book.getKanban();
    }
}
