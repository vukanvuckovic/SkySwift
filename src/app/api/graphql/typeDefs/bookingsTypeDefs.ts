import gql from "graphql-tag";

export const bookingTypeDefs = gql`
  type Query {
    getMyBookings: [Booking]
    bookingStatus: Booking
  }

  type Mutation {
    verifyBooking(bookingId: String!, contact: String!): Boolean
    postBooking(booking: BookingInput): Booking
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

  enum TripTypeEnum {
    oneway
    returning
  }

  enum GenderEnum {
    male
    female
  }

  enum FlightClassEnum {
    basic
    ecojet
    flex
    premium
  }

  type BookingFlightsSchema {
    going: [FlightSchema]
    returning: [FlightSchema]
  }

  type PassengerSchema {
    firstName: String
    lastName: String
    dateOfBirth: Date #Date
    gender: GenderEnum
    email: String
    phone: Int
    seats: [AdditionalOptionSchema]
    meals: [AdditionalOptionSchema]
    luggage: [AdditionalOptionSchema]
  }

  type FlightSchema {
    flight: Flight
    price: Int
    flightClass: FlightClassEnum
  }

  type AdditionalOptionSchema {
    name: String
    price: Int
    flight: Flight
    quantity: Int
  }

  type Booking {
    id: ID!
    flights: BookingFlightsSchema
    passengers: [PassengerSchema]
    contact: String
    price: Int
    tripType: TripTypeEnum
  }

  # ///---------------------÷

  input BookingFlightsInput {
    going: [FlightInput]
    returning: [FlightInput]
  }

  input PassengerInput {
    firstName: String
    lastName: String
    dateOfBirth: Date
    gender: GenderEnum
    email: String
    phone: String
    seats: [AdditionalOptionInput]
    meals: [AdditionalOptionInput]
    luggage: [AdditionalOptionInput]
  }

  input FlightInput {
    flight: String
    price: Int
    flightClass: FlightClassEnum
  }

  input AdditionalOptionInput {
    name: String
    price: Int
    flight: String
    quantity: Int
  }

  input BookingInput {
    flights: BookingFlightsInput
    passengers: [PassengerInput]
    contact: String
    price: Int
    tripType: TripTypeEnum
  }
`;
