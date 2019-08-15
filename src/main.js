import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import prisma from './prisma.js'

const pubsub = new PubSub()

// Server
const server = new GraphQLServer({
    typeDefs: './src/typedefs.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context(request){
      return {  
          pubsub,
          prisma,
          request
      }
    }
});

server.start(
    () => {
        console.log('Server is running on PORT 4000!');
    }
);
