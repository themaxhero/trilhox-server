import { PubSub, withFilter } from "apollo-server";
import { IContext, IRepos } from "../context";
import { Permission } from "../entity/Member";
import { User } from "../entity/User";
import { IAddBookToKanbanInput,
         IAddLabelToKanbanInput,
         IAddMemberToKanbanInput,
         ICreateKanbanInput,
         IUpdateKanbanInput,
} from "../input.types";
import { xor } from "../utils";
import {
    AddBookToKanbanInputValidator,
    AddLabelToKanbanInputValidator,
    AddMemberToKanbanInputValidator,
    CreateKanbanArgsInputValidator,
    UpdateKanbanInputValidator,
    uuidValidator,
} from "../validator";

export class KanbanController{
    public static async create(input: ICreateKanbanInput,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub) {
        CreateKanbanArgsInputValidator(input);
        const kanban = await repos.kanban.create(user, input);
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        pubsub.publish("KANBAN_CREATED", { kanban });
        return kanban;
    }
    public static fetch(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        repos.kanban.fetch(id);
    }

    public static allBooks(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        repos.kanban.getBooks(id);
    }

    public static allLabels(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        repos.kanban.getLabels(id);
    }

    public static allMembers(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        repos.kanban.getMembers(id);
    }

    public static async addBook(id: string,
                                input: IAddBookToKanbanInput,
                                user: User,
                                repos: IRepos,
                                pubsub: PubSub) {
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        AddBookToKanbanInputValidator(input);
        const kanban = await repos.kanban.fetch(id);
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const book = await repos.book.create(input);
        if (book === undefined) {
            throw new Error("Book could not be created");
        }
        const newKanban = await repos.kanban.addBook(id, book);
        if (newKanban === undefined){
            throw new Error ("Kanban could not be updated");
        }
        pubsub.publish("BOOK_CREATED", { kanban: newKanban });
        return newKanban;
    }

    public static async addLabel(id: string,
                                 input: IAddLabelToKanbanInput,
                                 user: User,
                                 repos: IRepos,
                                 pubsub: PubSub) {
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        AddLabelToKanbanInputValidator(input);
        const kanban = await repos.kanban.fetch(id);
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const label = await repos.label.create(input);
        if (label === undefined) {
            throw new Error("Label could not be created");
        }
        const newKanban = await repos.kanban.addLabel(id, label);
        if (newKanban === undefined){
            throw new Error("Label could not be created");
        }
        pubsub.publish("KANBAN_UPDATED", { kanban: newKanban });
        return newKanban;
    }

    public static async addMember(id: string,
                                  input: IAddMemberToKanbanInput,
                                  user: User,
                                  repos: IRepos,
                                  pubsub: PubSub) {
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        AddMemberToKanbanInputValidator(input);
        const kanban = await repos.kanban.fetch(id);
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const gotUser = await repos.user.fetch(input.userId);
        if (gotUser === undefined){
            throw new Error("User not found");
        }
        const member = await repos.member.create(gotUser, kanban, input);
        if (member === undefined) {
            throw new Error("Member could be created");
        }
        const newKanban = await repos.kanban.addMember(id, member);
        if (kanban === undefined){
            throw new Error("Member could not be inserted");
        }
        pubsub.publish("KANBAN_UPDATED", { kanban: newKanban });
        pubsub.publish("MEMBER_ADDED", { member });
        return kanban;
    }

    public static async removeBook(id: string,
                                   user: User,
                                   repos: IRepos,
                                   pubsub: PubSub) {
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        const kanban = await repos.kanban.fetch(id);
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const book = await repos.book.remove(id);
        const newKanban = await repos.kanban.fetch(kanban.id);
        if (!book) {
            throw new Error("Book could not be removed");
        }
        if (newKanban === undefined){
            throw new Error("Kanban not found");
        }
        pubsub.publish("BOOK_REMOVED",
                       { id, kanban: newKanban });
        pubsub.publish("KANBAN_UPDATED", { kanban: newKanban });
        return book;
    }

    public static async removeMember(id: string,
                                     memberId: string,
                                     user: User,
                                     repos: IRepos,
                                     pubsub: PubSub) {
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        if (!uuidValidator(memberId)){
            throw new Error("Invalid Member ID");
        }
        const kanban = await repos.kanban.fetch(id);
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const newKanban = await repos.kanban.removeMember(id, memberId);
        if (newKanban === undefined){
            throw new Error("Member could not be removed");
        }
        pubsub.publish("KANBAN_UPDATED", { kanban: newKanban });
        pubsub.publish("MEMBER_REMOVED", { id, kanban: newKanban });
        return newKanban;
    }

    public static async remove(id: string,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        const kanban = await repos.kanban.fetch(id);
        if (kanban === undefined){
            throw new Error("Kanban not Found");
        }
        const author = kanban.author;
        const members = kanban.members;
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== author)){
            throw new Error("Access Denied");
        }
        const newKanban = await repos.kanban.remove(id);
        if (newKanban === undefined){
            throw new Error("Kanban could not be removed");
        }
        pubsub.publish("KANBAN_REMOVED", { id, author, members });
        return newKanban;
    }

    public static async update(id: string,
                               input: IUpdateKanbanInput,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Kanban ID");
        }
        UpdateKanbanInputValidator(input);
        const kanban = await repos.kanban.fetch(id);
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const newKanban = await repos.kanban.update(id, input);
        if (newKanban === undefined){
            throw new Error("Kanban not found or could not be updated");
        }
        pubsub.publish("KANBAN_UPDATED", { kanban: newKanban });
        return newKanban;
    }

    public static subscribeUpdated(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("KANBAN_UPDATED"),
                (_: any, { kanban }: any, { repos, user}: IContext) => {
                    const ownership = repos.user.ownsKanban(user, kanban);
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
                () => pubsub.asyncIterator("KANBAN_REMOVED"),
                (_: any,
                 { author, members }: any,
                 { repos, user }: IContext) => {
                    const ownership = author === user;
                    const membership = repos.user.hasMembership(user, members);
                    return ( ownership || membership );
                },
            ),
        };
    }
}
