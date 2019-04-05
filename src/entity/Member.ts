import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Kanban } from "./Kanban";
import { User } from "./User";

export enum Permission{
    COMMENTER = "COMMENTER",
    EDITOR = "EDITOR",
    READER = "READER",
}

@Entity("member")
export class Member extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @ManyToOne((type) => User, (user) => user.id)
    public user: User;

    @ManyToOne((type) => Kanban, (kanban) => kanban.id)
    public kanban: Kanban;

    @Column("varchar", {length: 16})
    public permission: Permission;

    constructor(user: User, kanban: Kanban, permission: Permission){
        super();
        this.user = user;
        this.kanban = kanban;
        this.permission = permission;
    }

    public getKanban(){
        return this.kanban;
    }
}
