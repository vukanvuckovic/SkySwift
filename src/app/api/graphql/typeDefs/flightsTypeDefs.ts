import gql from "graphql-tag";

export const flightTypeDefs = gql`
  type Query {
    searchFlights(
      from: String!
      to: String!
      returning: Boolean!
    ): FlightsResponse!
  }

  type Airport {
    name: String
    id: String
  }

  type FlightDestination {
    city: String
    airport: Airport
  }

  type PlaneSeatSchema {
    name: String
    price: Int
    benefits: [String]!
    rowsFrom: Int
    rowsTo: Int
  }

  type Plane {
    id: ID!
    name: String
    ailes: [String]
    seats: [PlaneSeatSchema]
  }

  type FlightClass {
    benefits: [String]
    price: Int
  }

  type FlightPricing {
    basic: FlightClass!
    ecojet: FlightClass!
    premium: FlightClass!
    flex: FlightClass!
  }

  type Flight {
    id: ID!
    from: FlightDestination!
    to: FlightDestination!
    plane: Plane!
    departure: Date!
    arrival: Date!
    takenSeats: [String!]!
    pricing: FlightPricing
  }

  type ConnectedFlight {
    connectingCity: String!
    flight1: Flight!
    flight2: Flight!
  }

  type FlightsResponse {
    directFlights: [Flight]!
    # connectedFlights: [ConnectedFlight]!
    connectedFlights: [[Flight]]!
    returningDirectFlights: [Flight]!
    # returningConnectedFlights: [ConnectedFlight]!
    returningConnectedFlights: [[Flight]]!
  }
`;
