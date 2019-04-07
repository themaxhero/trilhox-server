import { IContext } from "../context";

export default{
    allBooksFromKanban: async (_: any, { id }: any, { repos }: IContext) => {
        return await repos.kanban.getBooks(id);
    },
    allCardsFromBook: async (_: any, { id }: any, { repos }: IContext) => {
        return await repos.book.getCards(id);
    },
    allCommentsFromCard: async (_: any, { id }: any, { repos }: IContext) => {
        return await repos.card.getComments(id);
    },
    allLabelsFromKanban: async (_: any, { id }: any, { repos }: IContext) => {
        return await repos.kanban.getLabels(id);
    },
    allMembersFromKanban: async (_: any, { id }: any, { repos }: IContext) => {
        return await repos.kanban.getMembers(id);
    },
    allMyKanbans: async (_: any, __: any, { user }: IContext) => {
        return await user.kanbans;
    },
    allTasksFromCard: async (_: any, { id }: any, { repos }: IContext) => {
        return await repos.card.getTasks(id);
    },
    book: (_: any, { id }: any, { repos }: IContext) => {
        return repos.book.fetch(id);
    },
    card: (_: any, { id }: any, { repos }: IContext) => {
        return repos.card.fetch(id);
    },
    comment: (_: any, { id }: any, { repos }: IContext) => {
        return repos.comment.fetch(id);
    },
    kanban: (_: any, { id }: any, { repos }: IContext) => {
        return repos.kanban.fetch(id);
    },
    label: (_: any, { id }: any, { repos }: IContext) => {
        return repos.kanban.fetch(id);
    },
    me: (_: any, __: any, { user }: IContext) => {
        return user;
    },
    task: (_: any, { id }: any, { repos }: IContext) => {
        return repos.task.fetch(id);
    },
};
