import { Connection, Repository } from "typeorm";
import { Book } from "../entity/Book";
import { Card } from "../entity/Card";
import { Comment } from "../entity/Comment";
import { Kanban } from "../entity/Kanban";
import { Label } from "../entity/Label";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { IUpdateUserInput } from "../input.types";
import { BaseRepo } from "./Base.Repo";

export interface IUserCreationParams{
    username: string;
    email: string;
    password: string;
    name?: string;
    avatar?: string;
    token?: string;
}

export class UserRepo extends BaseRepo{
    private repo: Repository<User>;
    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(User);
    }

    public async create(input: IUserCreationParams){
        const user = new User(
            input.username,
            input.email,
            input.password,
            input.name,
            input.avatar,
            input.token,
        );
        return await user.save();
    }

    public fetchByEmail(email: string){
        return this.repo
                .createQueryBuilder("user")
                .where("user.email = :email", { email })
                .getOne();
    }

    public fetchByToken(token: string){
        return this.repo
                .createQueryBuilder("user")
                .where("user.token = :token", { token })
                .getOne();
    }

    public fetch(id: string){
        return this.repo
                .createQueryBuilder("user")
                .where("user.id = :id", { id })
                .getOne();
    }

    public fetchAll(){
        return this.repo
                .createQueryBuilder()
                .getMany();
    }

    public async githubAuth(token: string){
        await this.repo
                .createQueryBuilder("user")
                .where("user.token = token", { token })
                .getOne();
    }

    public update(id: string, changeset: IUpdateUserInput){
        this.dbconn
            .createQueryBuilder()
            .update(User)
            .set({... changeset})
            .where("id = :id", { id })
            .execute();
        return this.fetch(id);
    }

    public async addKanban(userId: string, kanban: Kanban){
        const user = await this.fetch(userId);
        if (user !== undefined){
            user.kanbans.push(kanban);
            return await user.save();
        }
    }

    public ownsBook(user: User, book: Book){
        return user.kanbans.includes(book.getKanban());
    }

    public ownsCard(user: User, card: Card){
        return user.kanbans.includes(card.getKanban());
    }

    public ownsComment(user: User, comment: Comment){
        return user.kanbans.includes(comment.getKanban());
    }

    public ownsKanban(user: User, kanban: Kanban){
        return user.kanbans.includes(kanban);
    }

    public ownsLabel(user: User, label: Label){
        return user.kanbans.includes(label.getKanban());
    }

    public ownsTask(user: User, task: Task){
        return user.kanbans.includes(task.getKanban());
    }

    public hasMembership(user: User, kanban: Kanban){
        for (const member of kanban.members){
            if (member.user === user){
                return true;
            }
        }
        return false;
    }
}
