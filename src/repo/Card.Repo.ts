import { Connection, Repository } from "typeorm";
import { Book } from "../entity/Book";
import { Card } from "../entity/Card";
import { Comment } from "../entity/Comment";
import { Label } from "../entity/Label";
import { Task } from "../entity/Task";
import { IAddCardToBookInput, IUpdateCardInput } from "../input.types";
import { BaseRepo } from "./Base.Repo";

export class CardRepo extends BaseRepo{
    private repo: Repository<Card>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(Card);
    }

    public async create(book: Book, input: IAddCardToBookInput){
        const card = new Card(
            book,
            input.name,
        );
        return await card.save();
    }

    public fetch(id: string){
        return this.repo
                .createQueryBuilder("card")
                .where("card.id = :id", {id})
                .getOne();
    }

    public fetchAll(){
        return this.repo
                .createQueryBuilder()
                .getMany();
    }

    public async getComments(id: string){
        return await this.fetch(id)
            .then((c) => {
                if (c !== undefined){
                    return c.comments;
                }
            });
    }

    public async getTasks(id: string){
        return await this.fetch(id)
            .then((c) => {
                if (c !== undefined){
                    return c.tasks;
                }
            });
    }

    public async addTask(id: string, task: Task){
        return await this.fetch(id)
            .then(async (c) => {
                    if (c !== undefined) {
                        c.tasks.push(task);
                        return await c.save();
                    }
                },
            );
    }

    public async removeTask(id: string, taskId: string){
        return await this.fetch(id)
            .then(async (c) => {
                    if (c !== undefined) {
                        c.tasks.filter((t) => t.id !== taskId);
                        return await c.save();
                    }
                },
            );
    }

    public async addLabel(id: string, label: Label){
        return await this.fetch(id)
            .then(async (c) => {
                    if (c !== undefined) {
                        c.labels.push(label);
                        return await c.save();
                    }
                },
            );
    }

    public async removeLabel(id: string, labelId: string){
        return await this.fetch(id)
            .then(async (c) => {
                    if (c !== undefined) {
                        c.labels.filter((l) => l.id !== labelId);
                        return await c.save();
                    }
                },
            );
    }

    public async addComment(id: string, comment: Comment){
        return await this.fetch(id)
            .then(async (c) => {
                    if (c !== undefined) {
                        c.comments.push(comment);
                        return await c.save();
                    }
                },
            );
    }

    public async removeComment(id: string, commentId: string){
        return await this.fetch(id)
            .then(async (c) => {
                    if (c !== undefined) {
                        c.comments.filter((co) => co.id !== commentId);
                        return await c.save();
                    }
                },
            );
    }

    public async move(id: string, book: Book){
        const card = await this.fetch(id);
        if (card !== undefined && card.getKanban() === book.getKanban()){
            card.book = book;
            return await card.save();
        }
    }

    public update(id: string, changeset: IUpdateCardInput){
        this.dbconn
            .createQueryBuilder()
            .update(Card)
            .set({... changeset})
            .where("id = :id", {id})
            .execute();
        return this.fetch(id);
    }

    public async remove(id: string){
        await this.dbconn
        .createQueryBuilder()
        .delete()
        .from(Card)
        .where("id = :id", { id })
        .execute();
        const deleted = await this.fetch(id);
        return (deleted === undefined);
    }
}
