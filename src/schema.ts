import { gql } from "apollo-server-express";
const typeDefs = gql`
    scalar DateTime

    input AddBookToKanbanInput{
        name: String
    }
    input AddLabelToKanbanInput{
        name: String!
        color: String!
    }
    input AddKanbanToUserInput{
        name: String!
    }
    input AddMemberToKanbanInput{
        userId: ID!
        permission: Permission!
    }
    input AddCardToBookInput{
        name: String
    }
    input AddTaskToCardInput{
        name: String!
        active: Boolean
    }
    input CreateKanbanInput{
        name: String!
        background: String!
    }
    input PostCommentOnCardInput{
        author: ID!
        content: String!
    }
    input UpdateUserInput{
        email: String
        password: String
        name: String
        avatar: String
    }
    input UpdateKanbanInput{
        name: String
    }
    input UpdateMemberInput{
        permission: Permission!
    }
    input UpdateBookInput{
        name: String!
    }
    input UpdateCardInput{
        name: String
        description: String
    }
    input UpdateLabelInput{
        name: String
        color: String
    }
    input UpdateTaskInput{
        name: String
        active: Boolean
    }
    input UpdateCommentInput{
        content: String
    }
    enum Permission{
        COMMENTER
        EDITOR
        READER
    }

    type Member{
        id: ID!
        user: User!
        kanban: Kanban!
        permission: Permission!
    }

    type Card{
        id: ID!
        name: String!
        description: String
        tasks: [Task!]!
        labels: [Label!]!
        book: Book!
        comments: [Comment!]!
    }

    type Task{
        id: ID!
        name: String!
        card: Card!
        active: Boolean!
    }

    type Label{
        id: ID!
        name: String!
        color: String!
        cards: [Card!]!
    }

    type Book{
        id: ID!
        name: String!
        kanban: Kanban!
        cards: [Card!]!
    }

    type Kanban{
        id: ID!
        name: String!
        background: String
        books: [Book!]!
        author: User!
        members: [Member!]!
    }

    type Comment{
        id: ID!
        content: String!
        author: User!
        card: Card!
        created: DateTime!
    }

    type User{
        id: ID!
        name: String!
        username: String!
        avatar: String!
        kanbans: [Kanban!]!
    }

    type Query {
        me: User!
        allMyKanbans: [Kanban]!
        allMembersFromKanban(id: ID!): [Member]!
        allBooksFromKanban(id: ID!): [Book]!
        allCardsFromBook(id: ID!): [Card]!
        allCommentsFromCard(id: ID!): [Comment]!
        allTasksFromCard(id: ID!): [Task]!
        allLabelsFromKanban: [Label]!
        kanban(id: ID!): Kanban!
        book(id: ID!): Book!
        card(id: ID!): Card!
        label(id: ID!): Label!
        comment(id: ID!): Comment!
        task(id: ID!): Task!
    }

    type Mutation {
        addBookToKanban(id: ID!, input: AddBookToKanbanInput): Kanban!
        addCardToBook(id: ID!, input: AddCardToBookInput): Book!
        addLabelToCard(id: ID!, labelId: ID!): Card!
        addLabelToKanban(id: ID!, input: AddLabelToKanbanInput): Kanban!
        addMemberToKanban(id: ID!, input: AddMemberToKanbanInput): Kanban!
        addTaskToCard(id: ID!, input: AddTaskToCardInput): Card!
        createKanban(input: CreateKanbanInput): Kanban!
        moveCard(id: ID!, bookId: ID!): Card!
        postCommentOnCard(id: ID!, input: PostCommentOnCardInput): Card!
        remCardFromBook(id: ID!, bookId: ID!): Book!
        remLabelFromCard(id: ID!, cardId: ID!): Card!
        remMemberFromKanban(id: ID!, kanbanId: ID!): Kanban!
        remTaskFromCard(id: ID!, cardId: ID!): Card!
        removeBook(id: ID!): Boolean!
        removeCard(id: ID!): Boolean!
        removeComment(id: ID!): Boolean!
        removeKanban(id: ID!): Boolean!
        removeLabel(id: ID!): Boolean!
        updateBook(id: ID!, input: UpdateBookInput): Book!
        updateCard(id: ID!, input: UpdateCardInput): Card!
        updateComment(id: ID!, input: UpdateCommentInput): Comment!
        updateKanban(id: ID!, input: UpdateKanbanInput): Kanban!
        updateLabel(id: ID!, input: UpdateLabelInput): Label!
        updateMember(id: ID!, input: UpdateMemberInput): Member!
        updateTask(id: ID!, input: UpdateTaskInput): Task!
        updateUser(input: UpdateUserInput): User!
    }

    type Subscription{
        bookUpdated: Book!
        bookRemoved: ID!
        cardMoved: Card!
        cardUpdated: Card!
        cardRemoved: ID!
        kanbanRemoved: ID!
        kanbanUpdated: Kanban!
        labelRemoved: ID!
        labelUpdated: Label!
        commentRemoved: ID!
        commentUpdated: Comment!
        memberAdded: Member!
        memberUpdated: Member!
        memberRemoved: ID!
        taskUpdated: Task!
        taskRemoved: ID!
        userUpdated: User!
    }

    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
  `;
export default typeDefs;
