import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Kanban } from "./Kanban";

export interface IUserConstructor{
    username: string;
    name?: string;
    token?: string;
    avatar?: string;
}

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", { length: 16, unique: true })
    public username: string;

    @Column("varchar", { length: 320, unique: true })
    public email: string;

    @Column("varchar", { length: 100, nullable: true })
    public name: string;

    @Column("varchar", { length: 255, nullable: true })
    public avatar: string;

    @Column("varchar", { length: 64 })
    public password: string;

    @Column("varchar", { length: 255, nullable: true })
    public token: string;

    @OneToMany((type) => Kanban, (kanban) => kanban.author)
    public kanbans!: Kanban[];

    constructor(
        username: string,
        email: string,
        password: string,
        name?: string,
        token?: string,
        avatar?: string,
    )
    {
        super();
        this.username = username;
        this.email    = email;
        this.password = password;
        this.name     = name || "";
        this.avatar   = avatar || "";
        this.token    = token || "";
    }
}
