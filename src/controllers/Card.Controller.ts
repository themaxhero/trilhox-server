import { PubSub, withFilter } from "apollo-server";
import { IContext, IRepos } from "../context";
import { Permission } from "../entity/Member";
import { User } from "../entity/User";
import { IAddTaskToCardInput,
         IPostCommentOnCardInput,
         IUpdateCardInput,
} from "../input.types";
import { xor } from "../utils";
import { AddTaskToCardInputValidator,
         PostCommentOnCardInputValidator,
         UpdateCardInputValidator,
         uuidValidator,
} from "../validator";

export class CardController{
    public static fetch(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        repos.card.fetch(id);
    }

    public static allComments(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        repos.card.getComments(id);
    }

    public static allTasks(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        repos.card.getTasks(id);
    }

    public static async addLabel(id: string,
                                 labelId: string,
                                 user: User,
                                 repos: IRepos,
                                 pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        if (!uuidValidator(labelId)){
            throw new Error("Invalid Label ID");
        }
        const kanban = await repos.card.fetch(id)
            .then((c) => { if (c !== undefined ) { return c.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const label = await repos.label.fetch(labelId);
        if (label === undefined){
            throw new Error("Label not found");
        }
        const card = await repos.card.addLabel(id, label);
        if (card === undefined){
            throw new Error("Card could not be updated");
        }
        pubsub.publish("CARD_UPDATED", { card });
        return card;
    }

    public static async addTask(id: string,
                                input: IAddTaskToCardInput,
                                user: User,
                                repos: IRepos,
                                pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        AddTaskToCardInputValidator(input);
        const kanban = await repos.card.fetch(id)
            .then((c) => { if (c !== undefined ) { return c.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const task = await repos.task.create(input);
        if (task === undefined){
            throw new Error("Task could not be created");
        }
        const card = await repos.card.addTask(id, task);
        if (card === undefined){
            throw new Error("Card could not be updated");
        }
        pubsub.publish("CARD_UPDATED", { card });
        return card;
    }

    public static async postComment(id: string,
                                    input: IPostCommentOnCardInput,
                                    user: User,
                                    repos: IRepos,
                                    pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        PostCommentOnCardInputValidator(input);
        const kanban = await repos.card.fetch(id)
            .then((c) => { if (c !== undefined ) { return c.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const comment = await repos.comment.create(user, input);
        if (comment === undefined){
            throw new Error("Comment could not be created");
        }
        const card = await repos.card.addComment(id, comment);
        if (card === undefined){
            throw new Error("Card could not be updated");
        }
        pubsub.publish("CARD_UPDATED", { card });
        return card;

    }

    public static async removeLabel(id: string,
                                    labelId: string,
                                    user: User,
                                    repos: IRepos,
                                    pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        const kanban = await repos.card.fetch(id)
            .then((c) => { if (c !== undefined ) { return c.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (permission !== Permission.EDITOR || user !== kanban.author){
            throw new Error("Access Denied");
        }
        const card = await repos.card.fetch(id);
        if (card === undefined){
            throw new Error("Card not found");
        }
        const newCard = await repos.card.removeLabel(id, labelId);
        if (newCard === undefined){
            throw new Error("Card could not be updated");
        }
        pubsub.publish("CARD_UPDATED", { card: newCard });
        pubsub.publish("LABEL_REMOVED", { id, kanban });
        return newCard;
    }

    public static async removeTask(id: string,
                                   taskId: string,
                                   user: User,
                                   repos: IRepos,
                                   pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        const kanban = await repos.card.fetch(id)
            .then((c) => { if (c !== undefined ) { return c.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const card = await repos.card.fetch(id);
        if (card === undefined ){
            throw new Error("Card not found");
        }
        const newCard = await repos.card.removeTask(id, taskId);
        if (newCard === undefined){
            throw new Error("Card could not be updated");
        }
        pubsub.publish("TASK_REMOVED", { id, kanban });
        pubsub.publish("CARD_UPDATED", { card: newCard });
        return newCard;
    }

    public static async move(id: string,
                             bookId: string,
                             user: User,
                             repos: IRepos,
                             pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        const kanban = await repos.card.fetch(id)
            .then((c) => { if (c !== undefined ) { return c.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const book = await repos.book.fetch(bookId);
        if (book === undefined){
            throw new Error("Book not found");
        }
        const card =  await repos.card.move(id, book);
        if (card === undefined){
            throw new Error("Card could not be moved");
        }
        pubsub.publish("CARD_MOVED", { id, bookId });
        return card;
    }

    public static async update(id: string,
                               input: IUpdateCardInput,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        UpdateCardInputValidator(input);
        const kanban = await repos.card.fetch(id)
            .then((c) => { if (c !== undefined ) { return c.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const card = await repos.card.update(id, input);
        if (card === undefined){
            throw new Error("Card could not be updated");
        }
        pubsub.publish("CARD_UPDATED", { card });
        return card;
    }

    public static async remove(id: string,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Card ID");
        }
        const kanban = await repos.card.fetch(id)
            .then((c) => { if (c !== undefined ) { return c.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const card = await repos.card.remove(id);
        if (card === undefined){
            throw new Error("Card could not be removed");
        }
        pubsub.publish("CARD_REMOVED", { id, kanban });
        return card;
    }

    public static subscribeMoved(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("CARD_MOVED"),
                (_: any, { card }: any, { repos, user}: IContext) => {
                    const kanban = card.getKanban();
                    const ownership = repos.user.ownsCard(user, card);
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
                () => pubsub.asyncIterator("CARD_REMOVED"),
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
                () => pubsub.asyncIterator("CARD_UPDATED"),
                (_: any, { card }: any, { repos, user}: IContext) => {
                    const kanban = card.getKanban();
                    const ownership = repos.user.ownsCard(user, card);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }
}
