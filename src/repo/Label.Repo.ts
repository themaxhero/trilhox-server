import { Connection, Repository } from "typeorm";
import { Label } from "../entity/Label";
import { IAddLabelToKanbanInput, IUpdateLabelInput  } from "../input.types";
import { BaseRepo } from "./Base.Repo";

export class LabelRepo extends BaseRepo{
    private repo: Repository<Label>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(Label);
    }

    public async create(input: IAddLabelToKanbanInput){
        const label = new Label(input.name, input.color);
        return await label.save();
    }

    public fetch(id: string){
        return this.repo
                .createQueryBuilder("label")
                .where("label.id = :id", {id})
                .getOne();
    }

    public fetchAll(){
        return this.repo
                .createQueryBuilder()
                .getMany();
    }

    public update(id: string, changeset: IUpdateLabelInput){
        this.dbconn
            .createQueryBuilder()
            .update(Label)
            .set({... changeset})
            .where("id = :id", {id})
            .execute();
        return this.fetch(id);
    }

    public async remove(id: string){
        await this.dbconn
        .createQueryBuilder()
        .delete()
        .from(Label)
        .where("id = :id", { id })
        .execute();
        const deleted = await this.fetch(id);
        return (deleted === undefined);
    }
}
