import { PubSub } from "apollo-server";
import Mutation from "./Mutation";
import Query from "./Query";
import { createSubscriptionResolvers } from "./Subscription";
// import Subscription from "./Subscription"
// import Types from "./Types"

export function createResolvers(pubsub: PubSub){
    return {
        Mutation,
        Query,
        Subscription: createSubscriptionResolvers(pubsub),
    };
}
