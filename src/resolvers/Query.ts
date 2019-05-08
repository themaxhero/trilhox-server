import { IContext } from "../context";
import { BookController } from "../controllers/Book.Controller";
import { CardController } from "../controllers/Card.Controller";
import { CommentController } from "../controllers/Comment.Controller";
import { KanbanController } from "../controllers/Kanban.Controller";
import { LabelController } from "../controllers/Label.Controller";
import { TaskController } from "../controllers/Task.Controller";
import { UserController } from "../controllers/User.Controller";

export default{
    allBooksFromKanban: async (_: {}, { id }: any, { repos }: IContext) => {
        return KanbanController.allBooks(id, repos);
    },
    allCardsFromBook: async (_: {}, { id }: any, { repos }: IContext) => {
        return BookController.allCards(id, repos);
    },
    allCommentsFromCard: async (_: {}, { id }: any, { repos }: IContext) => {
        return CardController.allComments(id, repos);
    },
    allLabelsFromKanban: async (_: {}, { id }: any, { repos }: IContext) => {
        return KanbanController.allLabels(id, repos);
    },
    allMembersFromKanban: async (_: {}, { id }: any, { repos }: IContext) => {
        return KanbanController.allMembers(id, repos);
    },
    allMyKanbans: async (_: {}, __: any, { user, repos }: IContext) => {
        return UserController.allKanbans(user, repos);
    },
    allTasksFromCard: async (_: {}, { id }: any, { repos }: IContext) => {
        return CardController.allTasks(id, repos);
    },
    book: (_: {}, { id }: any, { repos }: IContext) => {
        return BookController.fetch(id, repos);
    },
    card: (_: {}, { id }: any, { repos }: IContext) => {
        return CardController.fetch(id, repos);
    },
    comment: (_: {}, { id }: any, { repos }: IContext) => {
        return CommentController.fetch(id, repos);
    },
    kanban: (_: {}, { id }: any, { repos }: IContext) => {
        return KanbanController.fetch(id, repos);
    },
    label: (_: {}, { id }: any, { repos }: IContext) => {
        return LabelController.fetch(id, repos);
    },
    me: (_: {}, __: any, { user }: IContext) => {
        return user;
    },
    task: (_: {}, { id }: any, { repos }: IContext) => {
        return TaskController.fetch(id, repos);
    },
};
