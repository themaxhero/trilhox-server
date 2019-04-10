import { PubSub, withFilter} from "apollo-server";
import { IContext, IRepos } from "../context";
import { Permission } from "../entity/Member";
import { User } from "../entity/User";
import { IUpdateCommentInput } from "../input.types";
import { xor } from "../utils";
import { UpdateCommentInputValidator, uuidValidator } from "../validator";

export class CommentController{
    public static async remove(id: string,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Comment ID");
        }
        const kanban = await repos.comment.fetch(id)
            .then((c) => { if (c !== undefined) { return c.getKanban(); }});
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const comment = await repos.comment.remove(id);
        if (comment === undefined){
            throw new Error("Comment could not be removed");
        }
        pubsub.publish("COMMENT_REMOVED", { id, kanban });
        return comment;
    }

    public static async update(id: string,
                               input: IUpdateCommentInput,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Comment ID");
        }
        UpdateCommentInputValidator(input);
        const kanban = await repos.comment.fetch(id)
            .then((c) => { if (c !== undefined) { return c.getKanban(); }});
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const comment = await repos.comment.update(id, input);
        if (comment === undefined){
            throw new Error("Comment not found");
        }
        pubsub.publish("COMMENT_UPDATED", { comment });
        return comment;
    }

    public static subscribeUpdated(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("COMMENT_UPDATED"),
                (_: any, { comment }: any, { repos, user}: IContext) => {
                    const kanban = comment.getKanban();
                    const ownership = repos.user.ownsComment(user, comment);
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
                () => pubsub.asyncIterator("COMMENT_REMOVED"),
                (_: any, { kanban }: any, { repos, user}: IContext) => {
                    const ownership = repos.user.ownsKanban(user, kanban);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }

}
