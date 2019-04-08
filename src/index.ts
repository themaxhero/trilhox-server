import { ApolloServer, PubSub } from "apollo-server-express";
import { compare, hash } from "bcrypt";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import * as expressValidator from "express-validator/check";
import "reflect-metadata";
import { ConnectionContext } from "subscriptions-transport-ws";
import { createServer } from "http";
import { sign, verify } from "jsonwebtoken";
import { Connection, createConnection } from "typeorm";
import WebSocket from "ws";
import { BookRepo } from "./repo/Book.Repo";
import { CardRepo } from "./repo/Card.Repo";
import { CommentRepo } from "./repo/Comment.Repo";
import { KanbanRepo } from "./repo/Kanban.Repo";
import { LabelRepo } from "./repo/Label.Repo";
import { MemberRepo } from "./repo/Member.Repo";
import { TaskRepo } from "./repo/Task.Repo";
import { UserRepo } from "./repo/User.Repo";
import { createResolvers } from "./resolvers";
import { JWT_SECRET } from "./keys";
import typeDefs from "./schema";
import { IRepos } from "./context";
import * as validator from "./validator";

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

    const getToken = (authorizationHeader: string | undefined,
                      res: Response) => {
        const token = authorizationHeader || false;

        if (!token || token.split(" ")[0] !== "Bearer"){
            const error = "invalid_auth_header";
            res.setHeader("Connection", "close");
            res.status(403).json({ error });
            res.end(`<h1>${ error.replace(/_/, " ").toUpperCase() }</h1>`);
            throw new Error("Invalid Authorization Header");
        }
            return token.split(" ")[1];
    };
    const context = async ({req, res}: any) => {
        const token = getToken(req.headers.authorization, res);
        const payload = verify(token, JWT_SECRET);
        const user    = await repos.user.fetchByToken(token);
        if (typeof(payload) !== "object"){
          res.status(401).json({ error: "invalid_token" });
        }
        const { id, email } = payload as any;
        if (typeof(user) !== "undefined"){
          if ((user.id === id) && (user.email === email)){
            return { repos, user, pubsub };
          }
        }
        res.status(401).json({ error: "invalid_token" });
      };
    
    const getTokenForSubs = (authorizationHeader: string | undefined,
                             wsocket: WebSocket) => {
        const token = authorizationHeader || false;

        if (!token){
            wsocket.terminate();
            throw new Error("Invalid Subscription Token");
        }
        return token.split(" ")[1];
    };

    interface IConnParams { authToken: string; }

    const onConnect = async (connParams: object, wsocket: WebSocket) => {
      if ("authToken" in (connParams as IConnParams)){
        const params  = (connParams as IConnParams);
        const token   = getTokenForSubs(params.authToken, wsocket);
        const payload = verify(token, JWT_SECRET);
        const user    = await repos.user.fetchByToken(token);
        if (typeof(payload) !== "object"){
          wsocket.terminate();
          throw new Error("Missing auth token!");
        }
        const { id, email } = payload as any;
        if (typeof(user) !== "undefined"){
          if ((user.id === id) && (user.email === email)){
            return { user };
          }
        }
        wsocket.terminate();
        throw new Error("Missing Auth token!");
      }
    };
  
    const onDisconnect = (wsocket: WebSocket, wsContext: ConnectionContext) => {
      wsocket.terminate();
    };

    const server = new ApolloServer({
        context,
        playground: false,
        resolvers: createResolvers(pubsub),
        subscriptions: { onConnect, onDisconnect },
        typeDefs,
    });

    const sendCookies = (res: Response,
                           username: string,
                           token: string,
                           expires: Date) => {
        res.cookie("username", username, { expires });
        res.cookie("token", token, { expires });
    };

    app.post("/register",
        async (req: Request, res: Response) => {
        if (!req.body.username || !req.body.email || !req.body.password){
            return res.status(400).json(["bad_request"]);
        } else {
            expressValidator.body("username").custom(validator.usernameValidator);
            expressValidator.body("email").isEmail();
            expressValidator.body("password").isLength({min: 8, max: 64});
            const errors = expressValidator.validationResult(req);

            if (errors.isEmpty()){
            hash(req.body.password, 10, async (err, hashedPassword) => {
                const { username, email } = req.body;
                const password = hashedPassword;
                const input    = { username, email, password };
                const date     = new Date();
                const user     = await repos.user.create(input);
                const id       = user.id;
                const payload  = { id, email };
                const token    = sign(payload, JWT_SECRET, { expiresIn: "7d" });
                date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
                sendCookies(res, username, token, date);
            });
            } else{
            console.log(`Error at: ${new Date().toUTCString}`);
            return res.status(400).json({errors: errors.array()});
            }
        }
        },
    );

    app.post("/login",
        async (req: Request, res: Response) => {
        expressValidator.check("email").isEmail();
        expressValidator.check("password").isLength({min: 8, max: 64});

        const errors = expressValidator.validationResult(req);
        if (errors.isEmpty()){
            const user = await repos.user.fetchByEmail(req.body.email);
            const password = req.body.password;

            if (!user){
            return res.status(400).json({ error: "invalid_user_or_password" });
            }

            const valid = await compare(password, user.password);

            if (!valid){
            return res.status(400).json({ error: "invalid_user_or_password" });
            }

            const id = user.id;
            const email = user.email;

            const token = sign({ id, email }, JWT_SECRET, {expiresIn: "7d"});
            user.token = token;
            user.save();

            const date = new Date();
            date.setTime(date.getDate() + (7 * 24 * 60 * 60 * 1000));

            sendCookies(res, user.username, token, date);
            res.send();
        } else{
            console.log(`Error at: ${new Date().toUTCString}`);
            return res.status(400).json({errors: errors.array()});
        }
        },
    );

    server.applyMiddleware({app, path: "/api"});

    const ws = createServer(app);

    server.installSubscriptionHandlers(ws);

    ws.listen({ port: PORT}, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
    });
});
