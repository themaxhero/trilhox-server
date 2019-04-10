import { IPostCommentOnCardInput, IUpdateCommentInput } from "src/input.types";
import { Connection, Repository } from "typeorm";
import { Card } from "../entity/Card";
import { Comment } from "../entity/Comment";
import { User } from "../entity/User";
import { BaseRepo } from "./Base.Repo";

export class CommentRepo extends BaseRepo{
    private repo: Repository<Comment>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(Comment);
    }

    public create(user: User, input: IPostCommentOnCardInput){
        const comment = new Comment(
            user,
            input.content,
        );
        return comment.save();
    }

    public fetch(id: string){
        return this.repo
                .createQueryBuilder("comment")
                .where("comment.id = :id", {id})
                .getOne();
    }

    public fetchAll(){
        return this.repo
                .createQueryBuilder()
                .getMany();
    }

    public update(id: string, changeset: IUpdateCommentInput){
        this.dbconn
            .createQueryBuilder()
            .update(Comment)
            .set({... changeset})
            .where("id = :id", {id})
            .execute();
        return this.fetch(id);
    }

    public async remove(id: string){
        await this.dbconn
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where("id = :id", { id })
        .execute();
        const deleted = await this.fetch(id);
        return (deleted === undefined);
    }
}
