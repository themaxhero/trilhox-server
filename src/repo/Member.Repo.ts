import { Connection, Repository } from "typeorm";
import { Kanban } from "../entity/Kanban";
import { Member, Permission } from "../entity/Member";
import { User } from "../entity/User";
import { IAddMemberToKanbanInput, IUpdateMemberInput } from "../input.types";
import { BaseRepo } from "./Base.Repo";

export class MemberRepo extends BaseRepo{
    private repo: Repository<Member>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.repo = dbconn.getRepository(Member);
    }

    public async create(user: User,
                        kanban: Kanban,
                        input: IAddMemberToKanbanInput){
        const member = new Member(
            user,
            kanban,
            input.permission,
        );
        return await member.save();
    }

    public fetch(id: string){
        return this.repo
                .createQueryBuilder("member")
                .where("member.id = :id", {id})
                .getOne();
    }

    public fetchAll(){
        return this.repo
                .createQueryBuilder()
                .getMany();
    }

    public update(id: string, changeset: IUpdateMemberInput){
        this.dbconn
            .createQueryBuilder()
            .update(Member)
            .set({... changeset})
            .where("id = :id", {id})
            .execute();
        return this.fetch(id);
    }

    public async setPermission(id: string, permission: Permission){
        const member = await this.fetch(id);
        if (member !== undefined){
            member.permission = permission;
            return member.save();
        }
    }
}
