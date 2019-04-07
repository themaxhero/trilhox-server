import { PubSub } from "apollo-server";
import { BookController } from "../controllers/Book.Controller";
import { CardController } from "../controllers/Card.Controller";
import { CommentController } from "../controllers/Comment.Controller";
import { KanbanController } from "../controllers/Kanban.Controller";
import { LabelController } from "../controllers/Label.Controller";
import { MemberController } from "../controllers/Member.Controller";
import { TaskController } from "../controllers/Task.Controller";
import { UserController } from "../controllers/User.Controller";

export const createSubscriptionResolvers = (pubsub: PubSub) => {
    return {
        bookRemoved: BookController.subscribeRemoved(pubsub),
        bookUpdated: BookController.subscribeUpdated(pubsub),
        cardMoved: CardController.subscribeMoved(pubsub),
        cardRemoved: CardController.subscribeRemoved(pubsub),
        cardUpdated: CardController.subscribeUpdated(pubsub),
        commentRemoved: CommentController.subscribeRemoved(pubsub),
        commentUpdated: CommentController.subscribeUpdated(pubsub),
        kanbanRemoved: KanbanController.subscribeRemoved(pubsub),
        kanbanUpdated: KanbanController.subscribeUpdated(pubsub),
        labelRemoved: LabelController.subscribeRemoved(pubsub),
        labelUpdated: LabelController.subscribeUpdated(pubsub),
        memberAdded: MemberController.subscribeAdded(pubsub),
        memberRemoved: MemberController.subscribeRemoved(pubsub),
        memberUpdated: MemberController.subscribeUpdated(pubsub),
        taskRemoved: TaskController.subscribeRemoved(pubsub),
        taskUpdated: UserController.subscribeUpdated(pubsub),
        userUpdated: UserController.subscribeRemoved(pubsub),
    };
};
