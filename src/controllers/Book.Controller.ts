import { PubSub, withFilter} from "apollo-server";
import { IContext, IRepos } from "../context";
import { Permission } from "../entity/Member";
import { User } from "../entity/User";
import { IAddCardToBookInput, IUpdateBookInput } from "../input.types";
import { xor } from "../utils";
import { AddCardToBookInputValidator,
         UpdateBookInputValidator,
         uuidValidator,
} from "../validator";

export class BookController{
    public static fetch(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Book ID");
        }
        return repos.book.fetch(id);
    }

    public static allCards(id: string, repos: IRepos){
        if (!uuidValidator(id)){
            throw new Error("Invalid Book ID");
        }
        return repos.book.getCards(id);
    }

    public static async addCard(id: string,
                                input: IAddCardToBookInput,
                                user: User,
                                repos: IRepos,
                                pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Book ID");
        }
        AddCardToBookInputValidator(input);
        const kanban = await repos.book.fetch(id)
            .then((b) => { if (b !== undefined ) { return b.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const book = await repos.book.fetch(id);
        if (book === undefined){
            throw new Error("Book not found");
        }
        const card = await repos.card.create(book, input);
        if (card === undefined){
            throw new Error("Card could not be created");
        }
        const newBook = await repos.book.addCard(id, card);
        if (book === undefined){
            throw new Error("Book could not be updated");
        }
        pubsub.publish("BOOK_UPDATED", { book: newBook });
        return newBook;
    }

    public static async removeCard(id: string,
                                   cardId: string,
                                   user: User,
                                   repos: IRepos,
                                   pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Book ID");
        }
        if (!uuidValidator(cardId)){
            throw new Error("Invalid Card ID");
        }
        const kanban = await repos.book.fetch(id)
            .then((b) => { if (b !== undefined ) { return b.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const card = await repos.card.fetch(cardId);
        if (card === undefined){
            throw new Error("Card could not be created");
        }
        const book = await repos.book.removeCard(id, cardId);
        if (book === undefined){
            throw new Error("Book could not be updated");
        }
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        pubsub.publish("BOOK_UPDATED", { book });
        pubsub.publish("CARD_REMOVED", { id: cardId, kanban });
        return book;
    }

    public static async update(id: string,
                               input: IUpdateBookInput,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Book ID");
        }
        UpdateBookInputValidator(input);
        const kanban = await repos.book.fetch(id)
            .then((b) => { if (b !== undefined ) { return b.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const book = await repos.book.update(id, input);
        if (book === undefined){
            throw new Error("Book could not be updated");
        }
        pubsub.publish("BOOK_UPDATED", { book });
        return book;
    }

    public static async remove(id: string,
                               user: User,
                               repos: IRepos,
                               pubsub: PubSub){
        if (!uuidValidator(id)){
            throw new Error("Invalid Book ID");
        }
        const kanban = await repos.book.fetch(id)
            .then((b) => { if (b !== undefined ) { return b.getKanban(); } });
        if (kanban === undefined){
            throw new Error("Kanban not found");
        }
        const permission = repos.kanban.accessType(kanban, user);
        if (xor(permission !== Permission.EDITOR, user !== kanban.author)){
            throw new Error("Access Denied");
        }
        const book = await repos.book.remove(id);
        if (kanban === undefined){
            throw new Error("Book not found");
        }
        if (book === undefined){
            throw new Error("Book could not be removed");
        }
        pubsub.publish("BOOK_REMOVED", { id, kanban });
        return book;
    }

    public static subscribeUpdated(pubsub: PubSub){
        return {
            subscribe: () =>
            withFilter(
                () => pubsub.asyncIterator("BOOK_UPDATED"),
                (_: any, { book }: any, { repos, user}: IContext) => {
                    const kanban = book.getKanban();
                    const ownership = repos.user.ownsBook(user, book);
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
                () => pubsub.asyncIterator("BOOK_REMOVED"),
                (_: any, { id, kanban }: any, { repos, user}: IContext) => {
                    const ownership = repos.user.ownsKanban(user, kanban);
                    const membership = repos.user.hasMembership(user, kanban);
                    return ( ownership || membership );
                },
            ),
        };
    }
}
