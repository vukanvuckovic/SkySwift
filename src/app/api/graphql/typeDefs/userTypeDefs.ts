import gql from "graphql-tag";

export const userTypeDefs = gql`
  type Query {
    me: User
  }

  type Mutation {
    logout: Boolean
    login(email: String!, password: String!): User
    register(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    bookings: [ID]
  }
`;
