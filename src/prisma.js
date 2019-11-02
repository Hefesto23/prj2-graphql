import { config } from "dotenv";
import { Prisma } from "prisma-binding";
import { fragReplacements } from "./resolvers/Index";

config();

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.GRAPHQL_HOST,
  secret: process.env.PRISMA_TOKEN,
  fragReplacements
});

export { prisma as default };
