import { IContext } from "../context";
import { BookController } from "../controllers/Book.Controller";
import { CardController } from "../controllers/Card.Controller";
import { CommentController } from "../controllers/Comment.Controller";
import { KanbanController } from "../controllers/Kanban.Controller";
import { LabelController } from "../controllers/Label.Controller";
import { MemberController } from "../controllers/Member.Controller";
import { TaskController} from "../controllers/Task.Controller";
import { UserController } from "../controllers/User.Controller";
import * as types from "./Mutation.Types";

export default{
    addBookToKanban:
        async (_: {},
               { id, input }: types.IAddBookArgs,
               { user, repos, pubsub }: IContext) =>
            KanbanController.addBook(id, input, user, repos, pubsub),

    addCardToBook:
        async (_: {},
               { id, input }: types.IAddCardArgs,
               { user, repos, pubsub }: IContext) =>
            BookController.addCard(id, input, user, repos, pubsub),

    addLabelToCard:
        async (_: {},
               { id, labelId }: types.IAddLabelCardArgs,
               { user, repos, pubsub }: IContext) =>
            CardController.addLabel(id, labelId, user, repos, pubsub),

    addLabelToKanban:
        async (_: {},
               { id, input }: types.IAddLabelKanbanArgs,
               { user, repos, pubsub }: IContext) =>
            KanbanController.addLabel(id, input, user, repos, pubsub),

    addMemberToKanban:
        async (_: {},
               { id, input }: types.IAddMemberArgs,
               { user, repos, pubsub }: IContext) =>
            KanbanController.addMember(id, input, user, repos, pubsub),

    addTaskToCard:
        async (_: {},
               { id, input }: types.IAddTaskArgs,
               { user, repos, pubsub }: IContext) =>
            CardController.addTask(id, input, user, repos, pubsub),

    createKanban:
        async (_: {},
               { input }: types.ICreateKanbanArgs,
               { user, repos, pubsub}: IContext ) =>
            KanbanController.create(input, user, repos, pubsub),

    moveCard:
        async (_: {},
               { id, bookId }: types.IMoveCardArgs,
               { user, repos, pubsub }: IContext) =>
            CardController.move(id, bookId, user, repos, pubsub),

    postCommentOnCard:
        async (_: {},
               { id, input }: types.IPostCommentArgs,
               { user, repos, pubsub }: IContext) =>
            CardController.postComment(id, input, user, repos, pubsub),

    remCardFromBook:
        async (_: {},
               { id, bookId }: types.IRemCardBookArgs,
               { user, repos, pubsub }: IContext) =>
            BookController.removeCard(bookId, id, user, repos, pubsub),

    remLabelFromCard:
        async (_: {},
               { id, cardId }: types.IRemLabelCardArgs,
               { user, repos, pubsub }: IContext) =>
            CardController.removeLabel(cardId, id, user, repos, pubsub),

    remMemberFromKanban:
        async (_: {},
               { id, kanbanId }: types.IRemMemberKanbanArgs,
               { user, repos, pubsub }: IContext) =>
            KanbanController.removeMember(kanbanId, id, user, repos, pubsub),

    remTaskFromCard:
        async (_: {},
               { id, cardId }: types.IRemTaskCardArgs,
               { user, repos, pubsub }: IContext) =>
            CardController.removeTask(cardId, id, user, repos, pubsub),

    removeBook:
        async (_: {},
               { id }: types.IRemBookArgs,
               { user, repos, pubsub }: IContext) =>
            BookController.remove(id, user, repos, pubsub),

    removeCard:
        async (_: {},
               { id }: types.IRemCardArgs,
               { user, repos, pubsub }: IContext) =>
            CardController.remove(id, user, repos, pubsub),

    removeComment:
        async (_: {},
               { id }: types.IRemCommentArgs,
               { user, repos, pubsub }: IContext) =>
            CommentController.remove(id, user, repos, pubsub),

    removeKanban:
        async (_: {},
               { id }: types.IRemKanbanArgs,
               { user, repos, pubsub }: IContext) =>
            KanbanController.remove(id, user, repos, pubsub),

    removeLabel:
        async (_: {},
               { id }: types.IRemLabelArgs,
               { user, repos, pubsub }: IContext) =>
            LabelController.remove(id, user, repos, pubsub),

    updateBook:
        async (_: {},
               { id, input }: types.IUpdateBookArgs,
               { user, repos, pubsub }: IContext) =>
            BookController.update(id, input, user, repos, pubsub),

    updateCard:
        async (_: {},
               { id, input }: types.IUpdateCardArgs,
               { user, repos, pubsub }: IContext) =>
            CardController.update(id, input, user, repos, pubsub),

    updateComment:
        async (_: {},
               { id, input }: types.IUpdateCommentArgs,
               { user, repos, pubsub }: IContext) =>
            CommentController.update(id, input, user, repos, pubsub),

    updateKanban:
        async (_: {},
               { id, input }: types.IUpdateKanbanArgs,
               { user, repos, pubsub }: IContext) =>
            KanbanController.update(id, input, user, repos, pubsub),

    updateLabel:
        async (_: {},
               { id, input }: types.IUpdateLabelArgs,
               { user, repos, pubsub }: IContext) =>
            LabelController.update(id, input, user, repos, pubsub),

    updateMember:
        async (_: {},
               { id, input }: types.IUpdateMemberArgs,
               { user, repos, pubsub }: IContext) =>
            MemberController.update(id, input, user, repos, pubsub),

    updateTask:
        async (_: {},
               { id, input }: types.IUpdateTaskArgs,
               { user, repos, pubsub }: IContext) =>
            TaskController.update(id, input, user, repos, pubsub),

    updateUser:
        async (_: {},
               { input }: types.IUpdateUserArgs,
               { user, repos, pubsub }: IContext) =>
            UserController.update(user, input, repos, pubsub),
};
