import { Book } from "src/entity/Book";
import { Connection, Repository } from "typeorm";
import { Kanban } from "../entity/Kanban";
import { Label } from "../entity/Label";
import { Member } from "../entity/Member";
import { User } from "../entity/User";
import { IAddKanbanToUserInput, IUpdateKanbanInput } from "../input.types";
import { BaseRepo } from "./Base.Repo";

export class KanbanRepo extends BaseRepo{
    private repo: Repository<Kanban>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(Kanban);
    }

    public async create(author: User, input: IAddKanbanToUserInput){
        const kanban = new Kanban(
            author,
            input.background,
            input.name,
        );
        return await kanban.save();
    }

    public fetch(id: string){
        return this.repo
                .createQueryBuilder("kanban")
                .where("kanban.id = :id", {id})
                .getOne();
    }

    public fetchAll(){
        return this.repo
                .createQueryBuilder()
                .getMany();
    }

    public async getBooks(id: string){
        return await this.fetch(id)
            .then((k) => {
                if (k !== undefined){
                    return k.books;
                }
            });
    }

    public async getLabels(id: string){
        return await this.fetch(id)
            .then((k) => {
                if (k !== undefined){
                    return k.labels;
                }
            });
    }

    public async getMembers(id: string){
        return await this.fetch(id)
            .then((k) => {
                if (k !== undefined){
                    return k.members;
                }
            });
    }

    public async addBook(id: string, book: Book){
        return await this.fetch(id)
            .then(async (k) => {
                    if (k !== undefined) {
                        k.books.push(book);
                        return await k.save();
                    }
                },
            );
    }

    public async removeBook(id: string, bookId: string){
        return await this.fetch(id)
            .then(async (k) => {
                    if (k !== undefined) {
                        k.books.filter((b) => b.id !== bookId);
                        return await k.save();
                    }
                },
            );
    }

    public async addMember(id: string, member: Member){
        return await this.fetch(id)
            .then(async (k) => {
                    if (k !== undefined) {
                        k.members.push(member);
                        return await k.save();
                    }
                },
            );
    }

    public async removeMember(id: string, memberId: string){
        return await this.fetch(id)
            .then(async (k) => {
                    if (k !== undefined) {
                        k.members.filter((m) => m.id !== memberId);
                        return await k.save();
                    }
                },
            );
    }

    public async addLabel(id: string, label: Label){
        return await this.fetch(id)
            .then(async (k) => {
                    if (k !== undefined) {
                        k.labels.push(label);
                        return await k.save();
                    }
                },
            );
    }

    public async removeLabel(id: string, labelId: string){
        return await this.fetch(id)
            .then(async (k) => {
                    if (k !== undefined) {
                        k.labels.filter((m) => m.id !== labelId);
                        return await k.save();
                    }
                },
            );
    }

    public update(id: string, changeset: IUpdateKanbanInput){
        this.dbconn
            .createQueryBuilder()
            .update(Kanban)
            .set({... changeset})
            .where("id = :id", {id})
            .execute();
        return this.fetch(id);
    }

    public accessType(kanban: Kanban, user: User){
        for (const member of kanban.members){
            if (user === member.user){
                return member.permission;
            }
        }
        return "ACCESS_DENIED";
    }

    public async remove(id: string){
        await this.dbconn
        .createQueryBuilder()
        .delete()
        .from(Kanban)
        .where("id = :id", { id })
        .execute();
        const deleted = await this.fetch(id);
        return (deleted === undefined);
    }
}
