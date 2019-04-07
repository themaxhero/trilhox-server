import { PubSub } from "apollo-server";
import { User } from "./entity/User";
import { BookRepo } from "./repo/Book.Repo";
import { CardRepo } from "./repo/Card.Repo";
import { CommentRepo } from "./repo/Comment.Repo";
import { KanbanRepo } from "./repo/Kanban.Repo";
import { LabelRepo } from "./repo/Label.Repo";
import { MemberRepo } from "./repo/Member.Repo";
import { TaskRepo } from "./repo/Task.Repo";
import { UserRepo } from "./repo/User.Repo";

export interface IRepos{
    book: BookRepo;
    card: CardRepo;
    comment: CommentRepo;
    kanban: KanbanRepo;
    label: LabelRepo;
    member: MemberRepo;
    task: TaskRepo;
    user: UserRepo;
}

export interface IContext{
    repos: IRepos;
    user: User;
    pubsub: PubSub;
}