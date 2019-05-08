import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./Book";
import { Label } from "./Label";
import { Member } from "./Member";
import { User } from "./User";

@Entity("kanban")
export class Kanban extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", {length: 20})
    public name: string;

    @Column("varchar", {length: 255})
    public background!: string;

    @OneToMany((type) => Book, (book) => book.kanban)
    public books!: Book[];

    @ManyToOne((type) => User, (user) => user.kanbans)
    @JoinColumn()
    public author: User;

    @OneToMany((type) => Member, (member) => member.kanban)
    public members!: Member[];

    @OneToMany((type) => Label, (label) => label.kanban)
    public labels!: Label[];

    constructor(author: User, background: string, name?: string){
        super();
        this.name = name || "New Kanban";
        this.author = author;
        this.background = background;
    }
}
