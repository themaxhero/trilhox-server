import { PubSub, withFilter } from "apollo-server";
import { IContext, IRepos } from "../context";
import { User } from "../entity/User";
import { IUpdateMemberInput } from "../input.types";
import { UpdateMemberInputValidator, uuidValidator } from "../validator";

export class MemberController{
    public static async update(id: string,
                               input: IUpdateMemberInput,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Member ID");
        }
        UpdateMemberInputValidator(input);
        const kanban = await repos.member.fetch(id)
            .then((m) => { if (m !== undefined ) { return m.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        if (user !== kanban.author){
            throw new Error("Access Denied");
        }
        const member = await repos.member.update(id, input);
        if (member === undefined){
            throw new Error("Member could not be updated");
        }
        pubsub.publish("MEMBER_UPDATED", { member });
        return member;
    }

    public static subscribeAdded(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("MEMBER_ADDED"),
                (_: any, { member }: any, { repos, user}: IContext) => {
                    const kanban = member.getKanban();
                    const ownership = repos.user.ownsKanban(user, kanban);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }

    public static subscribeRemoved(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("MEMBER_REMOVED"),
                (_: any, { kanban }: any, { repos, user}: IContext) => {
                    const ownership = repos.user.ownsKanban(user, kanban);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }

    public static subscribeUpdated(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("MEMBER_UPDATED"),
                (_: any, { member }: any, { repos, user}: IContext) => {
                    const kanban = member.getKanban();
                    const ownership = repos.user.ownsKanban(user, kanban);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }
}
