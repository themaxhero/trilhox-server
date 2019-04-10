import { PubSub, withFilter } from "apollo-server";
import { IContext, IRepos } from "../context";
import { Kanban } from "../entity/Kanban";
import { Permission } from "../entity/Member";
import { User } from "../entity/User";
import { IUpdateTaskInput } from "../input.types";
import { xor } from "../utils";
import { UpdateTaskInputValidator, uuidValidator } from "../validator";

interface ISubRemoved {
    id: string;
    kanban: Kanban;
}

export class TaskController{
    public static fetch(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Task ID");
        }
        repos.task.fetch(id);
    }

    public static async update(id: string,
                               input: IUpdateTaskInput,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Task ID");
        }
        UpdateTaskInputValidator(input);
        const kanban = await repos.task.fetch(id)
            .then((t) => { if (t !== undefined ) { return t.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const task = await repos.task.update(id, input);
        if (task === undefined){
            throw new Error("Book could not be updated");
        }
        pubsub.publish("TASK_UPDATED", { task });
        return task;
    }

    public static subscribeRemoved(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("TASK_REMOVED"),
                (_: {}, { kanban }: ISubRemoved, { repos, user}: IContext) => {
                    const ownership = repos.user.ownsKanban(user, kanban);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }
}
