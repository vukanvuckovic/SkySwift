import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

// Custom Date Scalar
export const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "A date scalar for ISO strings",
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString(); // Convert Date to ISO string for the response
    }
    throw new Error("DateScalar can only serialize Date objects");
  },
  parseValue(value: unknown): Date {
    if (typeof value === "string" || typeof value === "number") {
      return new Date(value); // Convert string/number to Date
    }
    throw new Error("DateScalar can only parse strings or numbers");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(ast.value); // Convert AST string/int to Date
    }
    return null;
  },
});
