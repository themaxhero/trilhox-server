import { Connection, Repository } from "typeorm";
import { Task } from "../entity/Task";
import { BaseRepo } from "./Base.Repo";

export interface ITaskCreationParams{
    name: string;
    active: boolean;
}

export interface ITaskChangeset{
    name?: string;
    active?: boolean;
}

export class TaskRepo extends BaseRepo{
    private repo: Repository<Task>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(Task);
    }

    public create(input: ITaskCreationParams){
        const task = new Task(input.name, input.active);
        return task.save();
    }

    public fetch(id: string){
        return this.repo
                .createQueryBuilder("task")
                .where("task.id = :id", {id})
                .getOne();
    }

    public fetchAll(){
        return this.repo
                .createQueryBuilder()
                .getMany();
    }

    public update(id: string, changeset: ITaskChangeset){
        this.dbconn
            .createQueryBuilder()
            .update(Task)
            .set({... changeset})
            .where("id = :id", {id})
            .execute();
        return this.fetch(id);
    }

    public async remove(id: string){
        await this.dbconn
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where("id = :id", { id })
        .execute();
        const deleted = await this.fetch(id);
        return (deleted === undefined);
    }
}
