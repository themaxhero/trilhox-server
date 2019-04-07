import { Connection, Repository } from "typeorm";
import { Book } from "../entity/Book";
import { Card } from "../entity/Card";
import { Kanban } from "../entity/Kanban";
import { BaseRepo } from "./Base.Repo";

export interface IBookCreationParams{
    kanban: Kanban;
    cards?: Card[];
    name?: string;
}
export interface IBookChangeset{
    name?: string;
}

export class BookRepo extends BaseRepo{
    private repo: Repository<Book>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(Book);
    }

    public create(input: IBookCreationParams){
        const book = new Book(input.name);
        return book.save();
    }

    public fetch(id: string){
        return this.repo
                .createQueryBuilder("book")
                .where("book.id = :id", {id})
                .getOne();
    }

    public fetchAll(){
        return this.repo
                .createQueryBuilder()
                .getMany();
    }

    public async getCards(id: string){
        return await this.fetch(id)
            .then((b) => {
                if (b !== undefined){
                    return b.cards;
                }
            });
    }

    public async addCard(id: string, card: Card){
        return await this.fetch(id)
            .then(async (b) => {
                    if (b !== undefined) {
                        b.cards.push(card);
                        return await b.save();
                    }
                },
            );
    }

    public async removeCard(id: string, cardId: string){
        return await this.fetch(id)
            .then(async (b) => {
                    if (b !== undefined) {
                        b.cards.filter((c) => c.id !== cardId);
                        return await b.save();
                    }
                },
            );
    }

    public update(id: string, changeset: IBookChangeset){
        this.dbconn
            .createQueryBuilder()
            .update(Book)
            .set({... changeset})
            .where("id = :id", {id})
            .execute();
        return this.fetch(id);
    }

    public async remove(id: string){
        await this.dbconn
        .createQueryBuilder()
        .delete()
        .from(Book)
        .where("id = :id", { id })
        .execute();
        const deleted = await this.fetch(id);
        return (deleted === undefined);
    }
}
