type Destination = {
  city: string;
  airport: {
    name: string;
    id: string;
  };
};

type FlightDetails = {
  id: string;
  from: Destination;
  to: Destination;
  departure: Date;
  arrival: Date;
  plane: {
    id: string;
    name: string;
  };
  pricing: {
    basic: {
      price: string;
    };
    ecojet: {
      price: string;
    };
    premium: {
      price: string;
    };
    flex: {
      price: string;
    };
  };
};

type AdditionalOption = {
  name: string;
  price: number;
  flight: FlightDetails;
  quantity: number;
};

type Booking = {
  id: string;
  flights: {
    going: {
      flight: FlightDetails;
      flightClass: string;
      price: number;
    }[];
    returning: {
      flight: FlightDetails;
      flightClass: string;
      price: number;
    }[];
  };
  passengers: {
    firstName: string;
    seats: AdditionalOptionFields[];
    meals: AdditionalOptionFields[];
    luggage: AdditionalOptionFields[];
  };
  contact: string;
  price: string;
  tripType: "oneway" | "returning";
};

type Passenger = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  email: string;
  phone: number;
  seats: AdditionalOption[];
  meals: AdditionalOption[];
  luggage: AdditionalOption[];
};

type ConnectedFlight = {
  connectingCity: string;
  flight1: BookingFlight;
  flight2: BookingFlight;
};

type FlightClassFromData = {
  name: string;
  options: string[];
  price: number;
  color: string;
};

type FlightClassName = "basic" | "ecojet" | "flex" | "premium";
