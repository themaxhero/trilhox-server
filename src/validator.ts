import { Request, Response } from "express";
import { check } from "express-validator/check";
import { IAddBookToKanbanInput,
         IAddCardToBookInput,
         IAddKanbanToUserInput,
         IAddLabelToKanbanInput,
         IAddMemberToKanbanInput,
         IAddTaskToCardInput,
         ICreateKanbanInput,
         IPostCommentOnCardInput,
         IUpdateBookInput,
         IUpdateCardInput,
         IUpdateCommentInput,
         IUpdateKanbanInput,
         IUpdateLabelInput,
         IUpdateMemberInput,
         IUpdateTaskInput,
         IUpdateUserInput,
} from "./input.types";
type payloadContent =
    string | number | boolean;

interface IRequestResponseKeeper {req?: Request; res?: Response; }

function validateUsername(value: any){
    if (typeof(value) === "string"){
        return (!value.includes(";") || !value.includes("*"));
    }
    return false;
}

function validatePermission(value: any){
    if (typeof(value) === "string"){
        const p = /^(COMMENTER | EDITOR | READER)$/;
        return p.test(value);
    }
    return false;
}

function validateUrl(value: any){
    if (typeof(value) === "string"){
        const p = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
        return p.test(value);
    }
    return false;
}

function validateColor(value: any){
    const p = /^#[a-f0-9]{3,6}$/i;
    if (typeof(value) === "string"){
        return p.test(value);
    }
}

function validateBoolean(value: any){
    return (typeof(value) === "boolean");
}

function validateDescription(value: any){
    return (typeof(value) === "string");
}

function validateEmail(value: any){
    check("email");
    if (typeof(value) === "string"){
        return true;
    }
}

export const usernameValidator =
    (value: payloadContent, { req }: IRequestResponseKeeper) => {
        return validateUsername(value);
    };

export function uuidValidator(idCandidate: string){
    // tslint:disable-next-line
    const p = /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/;
    return p.test(idCandidate);
}

export function AddBookToKanbanInputValidator(input: IAddBookToKanbanInput){
    if (!validateUsername(input.name)){
        throw new Error("Invalid Book Name");
    }
    return true;
}
export function AddLabelToKanbanInputValidator(input: IAddLabelToKanbanInput){
    if (!validateUsername(input.name)){
        throw new Error("Invalid Label Name");
    }
    if (!validateColor(input.color)){
        throw new Error("Invalid Color");
    }
    return true;

}
export function AddMemberToKanbanInputValidator(input: IAddMemberToKanbanInput){
    if (uuidValidator(input.userId)){
        throw new Error("Invalid User ID");
    }
    if (validatePermission(input.permission)){
        throw new Error("Invalid Permission");
    }
    return true;
}
export function AddCardToBookInputValidator(input: IAddCardToBookInput){
    if (!validateUsername(input.name)){
        throw new Error("Invalid Card Name");
    }
    return true;
}
export function AddKanbanToUserInputValidator(input: IAddKanbanToUserInput){
    if (!validateUsername(input.name)){
        throw new Error("Invalid Kanban Name");
    }
    return true;
}
export function AddTaskToCardInputValidator(input: IAddTaskToCardInput){
    if (!validateUsername(input.name)){
        throw new Error("Invalid Task Name");
    }
    if (!validateBoolean(input.active)){
        throw new Error("Invalid Task Status");
    }
    return true;
}

export function CreateKanbanArgsInputValidator(input: ICreateKanbanInput){
    if (!validateUsername(input.name)){
        throw new Error("Invalid Kanban name");
    }
    if (!validateUrl(input.background)){
        throw new Error("Invalid background url");
    }
}

export function PostCommentOnCardInputValidator(input: IPostCommentOnCardInput){
    if (uuidValidator(input.author)){
        throw new Error("Invalid Card ID");
    }
    if (validateDescription(input.content)){
        throw new Error("Invalid Comment Content");
    }
    return true;
}
export function UpdateUserInputValidator(input: IUpdateUserInput){
    if (input.email){
        if (!validateEmail(input.email)){
            throw new Error("Invalid Email");
        }
    }
    if (input.name){
        if (!validateEmail(input.name)){
            throw new Error("Invalid Name");
        }
    }
    if (input.avatar){
        if (!validateEmail(input.avatar)){
            throw new Error("Invalid Avatar");
        }
    }
    return true;
}
export function UpdateKanbanInputValidator(input: IUpdateKanbanInput){
    if (input.name){
        if (!validateUsername(input.name)){
            throw new Error("Invalid Kanban Name");
        }
    }
    return true;
}
export function UpdateMemberInputValidator(input: IUpdateMemberInput){
    if (!validatePermission(input.permission)){
        throw new Error("Invalid Permission");
    }
    return true;
}
export function UpdateBookInputValidator(input: IUpdateBookInput){
    if (input.name){
        if (!validateUsername(input.name)){
            throw new Error("Invalid Book Name");
        }
    }
    return true;
}
export function UpdateCardInputValidator(input: IUpdateCardInput){
    if (input.name){
        if (!validateUsername(input.name)){
            throw new Error("Invalid Card Name");
        }
    }
    if (input.name){
        if (!validateDescription(input.description)){
            throw new Error("Invalid Card Description");
        }
    }
    return true;

}
export function UpdateLabelInputValidator(input: IUpdateLabelInput){
    if (input.name){
        if (!validateUsername(input.name)){
            throw new Error("Invalid Label Name");
        }
    }
    return true;
}
export function UpdateTaskInputValidator(input: IUpdateTaskInput){
    if (input.name){
        if (!validateUsername(input.name)){
            throw new Error("Invalid Task Name");
        }
    }
    return true;

}
export function UpdateCommentInputValidator(input: IUpdateCommentInput){
    if (validateDescription(input.content)){
        throw new Error("Invalid Comment Content");
    }
    return true;
}
