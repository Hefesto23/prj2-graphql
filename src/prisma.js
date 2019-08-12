import { config } from "dotenv";
import { Prisma } from 'prisma-binding';

config();

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: `${process.env.GRAPHQL_HOST}:${process.env.GRAPHQL_PORT}`,
    secret: `${process.env.PRISMA_TOKEN}`
})

export { prisma as default }
