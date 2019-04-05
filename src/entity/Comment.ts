import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Card } from "./Card";
import { User } from "./User";

@Entity("comment")
export class Comment extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", {length: 512})
    public content: string;

    @ManyToOne((type) => User, (user) => user.id)
    public author: User;

    @ManyToOne((type) => Card, (card) => card.id)
    public card!: Card;

    @Column("timestamptz")
    public created!: Date;

    constructor(author: User, content: string){
        super();
        this.content = content;
        this.author = author;
    }
    public getKanban(){
        return this.card.getKanban();
    }
}
