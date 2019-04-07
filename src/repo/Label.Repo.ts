import { Connection, Repository } from "typeorm";
import { Label } from "../entity/Label";
import { BaseRepo } from "./Base.Repo";

export interface ILabelCreationParams{
    name: string;
    color: string;
}

export interface ILabelChangeset{
    name?: string;
    color?: string;
}

export class LabelRepo extends BaseRepo{
    private repo: Repository<Label>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(Label);
    }

    public async create(input: ILabelCreationParams){
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

    public update(id: string, changeset: ILabelChangeset){
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
