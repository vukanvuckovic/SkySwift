import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { flightTypeDefs } from "./typeDefs/flightsTypeDefs";
import { flightsResolvers } from "./resolvers/flightsResolver";
import { bookingTypeDefs } from "./typeDefs/bookingsTypeDefs";
import { bookingsResolver } from "./resolvers/bookingsResolver";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { userTypeDefs } from "./typeDefs/userTypeDefs";
import { userResolver } from "./resolvers/userResolver";
import { DateScalar } from "./scalars/dateScalar";

const customScalars = {
  Date: DateScalar,
};

const server = new ApolloServer({
  typeDefs: mergeTypeDefs([
    "scalar Date",
    flightTypeDefs,
    bookingTypeDefs,
    userTypeDefs,
  ]),
  resolvers: mergeResolvers([flightsResolvers, bookingsResolver, userResolver]),
});

let handler: ReturnType<typeof startServerAndCreateNextHandler> | null = null;

export const GET = async (req: Request) => {
  if (!handler) {
    handler = startServerAndCreateNextHandler(server);
  }
  return handler(req);
};

export const POST = async (req: Request) => {
  if (!handler) {
    handler = startServerAndCreateNextHandler(server);
  }
  return handler(req);
};
