import { GraphQLServer, PubSub } from "graphql-yoga";
import { resolvers, fragReplacements } from "./resolvers/Index";
import prisma from "./prisma";

const pubsub = new PubSub();

// Server
const server = new GraphQLServer({
  typeDefs: "./src/typedefs.graphql",
  resolvers,
  context(request) {
    return {
      pubsub,
      prisma,
      request
    };
  },
  fragReplacements
});

export { server as default };
