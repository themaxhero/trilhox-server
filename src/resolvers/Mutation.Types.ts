import { IAddBookToKanbanInput,
         IAddCardToBookInput,
         IAddKanbanToUserInput,
         IAddLabelToKanbanInput,
         IAddMemberToKanbanInput,
         IAddTaskToCardInput,
         IPostCommentOnCardInput,
         IUpdateBookInput,
         IUpdateCardInput,
         IUpdateCommentInput,
         IUpdateKanbanInput,
         IUpdateLabelInput,
         IUpdateMemberInput,
         IUpdateTaskInput,
         IUpdateUserInput,
} from "../input.types";

export interface IAddBookArgs {
    id: string;
    input: IAddBookToKanbanInput;
}

export interface IAddCardArgs {
    id: string;
    input: IAddCardToBookInput;
}

export interface IAddLabelCardArgs{
    id: string;
    labelId: string;
}

export interface IAddLabelKanbanArgs{
    id: string;
    input: IAddLabelToKanbanInput;
}

export interface IAddKanbanUserArgs{
    id: string;
    input: IAddKanbanToUserInput;
}

export interface IAddMemberArgs{
    id: string;
    input: IAddMemberToKanbanInput;
}

export interface IAddTaskArgs{
    id: string;
    input: IAddTaskToCardInput;
}

export interface IMoveCardArgs{
    id: string;
    bookId: string;
}

export interface IPostCommentArgs{
    id: string;
    input: IPostCommentOnCardInput;
}

export interface IRemCardBookArgs {
    id: string;
    bookId: string;
}

export interface IRemLabelCardArgs {
    id: string;
    cardId: string;
}

export interface IRemLabelKanbanArgs {
    id: string;
    kanbanId: string;
}

export interface IRemMemberKanbanArgs {
    id: string;
    kanbanId: string;
}

export interface IRemTaskCardArgs {
    id: string;
    cardId: string;
}

export interface IRemBookArgs{
    id: string;
}

export interface IRemCardArgs{
    id: string;
}

export interface IRemCommentArgs{
    id: string;
}

export interface IRemKanbanArgs{
    id: string;
}

export interface IRemLabelArgs{
    id: string;
}

export interface IUpdateBookArgs {
    id: string;
    input: IUpdateBookInput;
}

export interface IUpdateCardArgs {
    id: string;
    input: IUpdateCardInput;
}

export interface IUpdateCommentArgs {
    id: string;
    input: IUpdateCommentInput;
}

export interface IUpdateKanbanArgs {
    id: string;
    input: IUpdateKanbanInput;
}

export interface IUpdateLabelArgs {
    id: string;
    input: IUpdateLabelInput;
}

export interface IUpdateMemberArgs{
    id: string;
    input: IUpdateMemberInput;
}

export interface IUpdateTaskArgs{
    id: string;
    input: IUpdateTaskInput;
}

export interface IUpdateUserArgs{
    input: IUpdateUserInput;
}
