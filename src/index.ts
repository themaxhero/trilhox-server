import { ApolloServer, gql } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import "reflect-metadata";
import { createServer } from "http";
import { Connection, createConnection } from "typeorm";

createConnection().then(async (dbconn: Connection) => {
    const app = express();
  
    app.use(bodyParser.json());
  
    const PORT = 4600;

    const typeDefs = gql`
        type TestModel{
            bestSinger: String!
        }

        type Mutation{
            changeTheFacts(name: String): TestModel!
        }

        type Query{
            bestSinger: String!
        }

        schema{
            Mutation,
            Query
        }
    `

    interface IFakeDb {
        bestSinger: string;
    }

    interface IChangeTheFactsArgs{
        name: string;
    }

    const fakeDb: IFakeDb = {
        bestSinger: "Freddie Mercury"
    };

    const resolvers = {
        Mutation: {
            changeTheFacts: (_: {},
                             { name }: IChangeTheFactsArgs,
                             fakeDb: IFakeDb) => {
                console.log(
                    `Actually you can't change this undeniable truth.\n
                     but, let's pretend that you can.`);
                fakeDb.bestSinger = name;
                return fakeDb;
            }
        },
        Query: {
            bestSinger: (_: {}, __:{}, fakeDb: IFakeDb) => {
                return fakeDb.bestSinger;
            }
        },
    };

    const server = new ApolloServer({
        context: () => fakeDb,
        resolvers,
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
