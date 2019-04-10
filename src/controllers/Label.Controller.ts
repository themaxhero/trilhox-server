import { PubSub, withFilter} from "apollo-server";
import { IContext, IRepos } from "../context";
import { Permission } from "../entity/Member";
import { User } from "../entity/User";
import { ILabelChangeset } from "../repo/Label.Repo";
import { xor } from "../utils";
import { uuidValidator } from "../validator";

export class LabelController{
    public static async remove(id: string,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Label ID");
        }
        const kanban = await repos.label.fetch(id)
            .then((c) => { if (c !== undefined) { return c.getKanban(); }});
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const label = await repos.label.remove(id);
        pubsub.publish("LABEL_REMOVED", { id, kanban });
        return label;

    }

    public static async update(id: string,
                               input: ILabelChangeset,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub ){
        if (!uuidValidator(id)){
            throw new Error("Invalid Label ID");
        }
        const kanban = await repos.label.fetch(id)
            .then((l) => { if (l !== undefined) { return l.getKanban(); }});
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const label = await repos.label.update(id, input);
        if (label === undefined){
            throw new Error("Label could not be updated");
        }
        pubsub.publish("LABEL_UPDATED", { label });
        return label;
    }

    public static subscribeUpdated(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("LABEL_UPDATED"),
                (_: any, { label }: any, { repos, user}: IContext) => {
                    const kanban = label.getKanban();
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
                () => pubsub.asyncIterator("LABEL_REMOVED"),
                (_: any, { kanban }: any, { repos, user}: IContext) => {
                    const ownership = repos.user.ownsKanban(user, kanban);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }
}
