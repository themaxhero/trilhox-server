import { Permission } from "./entity/Member";

export interface IAddBookToKanbanInput{
    name: string;
}

export interface IAddLabelToKanbanInput{
    name: string;
    color: string;
}

export interface IAddMemberToKanbanInput{
    userId: string;
    permission: Permission;
}

export interface IAddCardToBookInput{
    name?: string;
}

export interface IAddKanbanToUserInput{
    name?: string;
}

export interface IAddTaskToCardInput{
    name: string;
    active?: boolean;
}

export interface ICreateKanbanInput{
    name: string;
    background: string;
}

export interface IPostCommentOnCardInput{
    author: string;
    content: string;
}

export interface IUpdateUserInput{
    email?: string;
    name?: string;
    avatar?: string;
}

export interface IUpdateKanbanInput{
    name?: string;
}

export interface IUpdateMemberInput{
    permission: Permission;
}

export interface IUpdateBookInput{
    name: string;
}

export interface IUpdateCardInput{
    name?: string;
    description?: string;
}

export interface IUpdateLabelInput{
    name?: string;
    color?: string;
}

export interface IUpdateTaskInput{
    name?: string;
    active?: boolean;
}

export interface IUpdateCommentInput{
    content: string;
}
