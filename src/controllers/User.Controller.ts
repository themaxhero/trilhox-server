import { PubSub, withFilter } from "apollo-server";
import { IContext, IRepos } from "../context";
import { User } from "../entity/User";
import { IAddKanbanToUserInput, IUpdateUserInput } from "../input.types";
import { UpdateUserInputValidator } from "../validator";

export class UserController{
    public static async allKanbans(user: User, repos: IRepos){
        const actualUser = await repos.user.allKanbans(user);
        return actualUser.kanbans ? actualUser.kanbans : [];
    }
    public static async update(user: User,
                               input: IUpdateUserInput,
                               repos: IRepos,
                               pubsub: PubSub){
        const u = await repos.user.update(user.id, input);
        if (u === undefined){
            throw new Error("User could not be updated");
        }
        UpdateUserInputValidator(input);
        pubsub.publish("USER_UPDATED", { user: u });
        return u;
    }

    public static async addKanban(input: IAddKanbanToUserInput,
                                  user: User,
                                  repos: IRepos,
                                  pubsub: PubSub){
        const kanban = await repos.kanban.create(user, input);
        if (kanban === undefined){
            throw new Error("Kanban could not be created");
        }
        const newUser = await repos.user.addKanban(user.id, kanban);
        if (newUser === undefined){
            throw new Error("User can could not create Kanban");
        }
        pubsub.publish("KANBAN_CREATED", { kanban });
        return newUser;
    }

    public static subscribeRemoved(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("USER_UPDATED"),
                (_: any, { subUser }: any, { user }: IContext) => {
                    return (subUser === user);
                },
            ),
        };
    }

    public static subscribeUpdated(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("TASK_UPDATED"),
                (_: any, { task }: any, { repos, user}: IContext) => {
                    const kanban = task.getKanban();
                    const ownership = repos.user.ownsKanban(user, kanban);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }
}
