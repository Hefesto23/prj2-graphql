import { config } from "dotenv";
import { Prisma } from 'prisma-binding';

config();

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: `${process.env.GRAPHQL_HOST}:${process.env.GRAPHQL_PORT}`,
})

export { prisma as default }
