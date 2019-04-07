import { IBookChangeset, IBookCreationParams } from "../repo/Book.Repo";
import { ICardChangeset, ICardCreationParams } from "../repo/Card.Repo";
import { ICommentChangeset, ICommentCreationParams } from "../repo/Comment.Repo";
import { IKanbanChangeset } from "../repo/Kanban.Repo";
import { ILabelChangeset, ILabelCreationParams } from "../repo/Label.Repo";
import { IMemberChangeset, IMemberCreationParams } from "../repo/Member.Repo";
import { ITaskChangeset, ITaskCreationParams } from "../repo/Task.Repo";
import { IUserChangeset } from "../repo/User.Repo";

export interface IAddBookArgs {
    id: string;
    input: IBookCreationParams;
}

export interface IAddCardArgs {
    id: string;
    input: ICardCreationParams;
}

export interface IAddLabelCardArgs{
    id: string;
    labelId: string;
}

export interface IAddLabelKanbanArgs{
    id: string;
    input: ILabelCreationParams;
}

export interface IAddCardArgs{
    id: string;
    input: ICardCreationParams;
}

export interface IAddMemberArgs{
    id: string;
    input: IMemberCreationParams;
}

export interface IAddTaskArgs{
    id: string;
    input: ITaskCreationParams;
}

export interface IMoveCardArgs{
    id: string;
    bookId: string;
}

export interface IPostCommentArgs{
    id: string;
    input: ICommentCreationParams;
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
    input: IBookChangeset;
}

export interface IUpdateCardArgs {
    id: string;
    input: ICardChangeset;
}

export interface IUpdateCommentArgs {
    id: string;
    input: ICommentChangeset;
}

export interface IUpdateKanbanArgs {
    id: string;
    input: IKanbanChangeset;
}

export interface IUpdateLabelArgs {
    id: string;
    input: ILabelChangeset;
}

export interface IUpdateMemberArgs{
    id: string;
    input: IMemberChangeset;
}

export interface IUpdateTaskArgs{
    id: string;
    input: ITaskChangeset;
}

export interface IUpdateUserArgs{
    input: IUserChangeset;
}
