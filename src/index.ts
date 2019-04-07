import { ApolloServer, PubSub } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import "reflect-metadata";
import { createServer } from "http";
import { Connection, createConnection } from "typeorm";
import { BookRepo } from "./repo/Book.Repo";
import { CardRepo } from "./repo/Card.Repo";
import { CommentRepo } from "./repo/Comment.Repo";
import { KanbanRepo } from "./repo/Kanban.Repo";
import { LabelRepo } from "./repo/Label.Repo";
import { MemberRepo } from "./repo/Member.Repo";
import { TaskRepo } from "./repo/Task.Repo";
import { UserRepo } from "./repo/User.Repo";
import { createResolvers } from "./resolvers";
import typeDefs from "./schema";
import { IContext, IRepos } from "./context";
import { User } from "./entity/User";

createConnection().then(async (dbconn: Connection) => {
    const app = express();
  
    app.use(bodyParser.json());
  
    const PORT = 4600;

    const pubsub = new PubSub();

    const repos: IRepos = {
        book: new BookRepo(dbconn),
        card: new CardRepo(dbconn),
        comment: new CommentRepo(dbconn),
        kanban: new KanbanRepo(dbconn),
        label: new LabelRepo(dbconn),
        member: new MemberRepo(dbconn),
        task: new TaskRepo(dbconn),
        user: new UserRepo(dbconn),
    };

    const user = new User("admin", "a@b.com", "oswaldo123");

    const server = new ApolloServer({
        context: (): IContext => {
            return { user, repos, pubsub } 
        },
        resolvers: createResolvers(pubsub),
        typeDefs,
      });

    server.applyMiddleware({app, path: "/api"});

    const ws = createServer(app);

    server.installSubscriptionHandlers(ws);

    ws.listen({ port: PORT}, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
    });
});
