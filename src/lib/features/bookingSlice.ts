import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Document } from "mongodb";

export interface FlightClass {
  benefits: string[];
  price: number;
}

export interface FlightDestination {
  city: string;
  airport: {
    name: string;
    id: string;
  };
}

export interface AirplaneData {
  name: string;
  ailes: string[];
  seats: {
    name: string;
    price: number;
    benefits: string[];
    rowsFrom: number;
    rowsTo: number;
  }[];
}

export interface Flight extends Document {
  from: FlightDestination;
  to: FlightDestination;
  plane: AirplaneData;
  departure: Date;
  arrival: Date;
  takenSeats: string[];
  pricing: {
    basic: FlightClass;
    ecojet: FlightClass;
    flex: FlightClass;
    premium: FlightClass;
  };
}

export interface BookingFlight {
  flight: Flight;
  flightClass: "basic" | "ecojet" | "flex" | "premium";
  price: number;
}

export interface AdditionalOption {
  name: string;
  price: number;
  flight: Flight;
  quantity?: number;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: "male" | "female";
  email: string;
  phone: string;
  seats: AdditionalOption[];
  meals: AdditionalOption[];
  luggage: AdditionalOption[];
}

export interface BookingState extends Document {
  tripType: "oneway" | "returning";
  flights: {
    going: BookingFlight[];
    returning: BookingFlight[];
  };
  passengers: Passenger[];
  contact: string;
  price: number;
  errors: Record<number, Record<string, string>>;
  passengerInfoValid: boolean;
}

const initialState: BookingState = {
  tripType: "oneway",
  flights: {
    going: [],
    returning: [],
  },
  passengers: [
    {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      email: "",
      phone: "",
      seats: [],
      meals: [],
      luggage: [],
    },
  ],
  contact: "",
  price: 0,
  errors: {},
  passengerInfoValid: false,
};

const calculateTotalPrice = (state: BookingState) => {
  let total = [...state.flights.going, ...state.flights.returning].reduce(
    (sum, flight) => sum + flight.price * state.passengers.length,
    0
  );

  state.passengers.forEach((passenger) => {
    total += (passenger.seats || []).reduce((sum, seat) => sum + seat.price, 0);
    total += (passenger.meals || []).reduce(
      (sum, meal) => sum + meal.price * meal.quantity!,
      0
    );
    total += (passenger.luggage || []).reduce(
      (sum, luggage) => sum + luggage.price,
      0
    );
  });

  return total;
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setTripType: (state, action: PayloadAction<"oneway" | "returning">) => {
      state.tripType = action.payload;
    },
    updateBooking: (state, action: PayloadAction<BookingState>) => {
      Object.assign(state, action.payload);
    },
    resetBooking: (state) => {
      Object.assign(state, initialState);
    },
    setGoingFlights: (state, action: PayloadAction<BookingFlight[]>) => {
      state.flights.going = action.payload;
      state.price = calculateTotalPrice(state);
    },
    setReturningFlights: (state, action: PayloadAction<BookingFlight[]>) => {
      state.flights.returning = action.payload;
      state.price = calculateTotalPrice(state);
    },
    removeFlights: (state, action: PayloadAction<string[]>) => {
      state.flights.going = state.flights.going.filter(
        (item) => !action.payload.includes(item.flight.id)
      );
      state.flights.returning = state.flights.returning.filter(
        (item) => !action.payload.includes(item.flight.id)
      );
      state.price = calculateTotalPrice(state);
    },
    setPassengers: (state, action: PayloadAction<number>) => {
      for (let i = state.passengers.length; i < action.payload; i++) {
        state.passengers.push({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: undefined,
          email: "",
          phone: "",
          seats: [],
          meals: [],
          luggage: [],
        });
      }
      if (state.passengers.length > action.payload) {
        state.passengers = state.passengers.slice(0, action.payload);
      }
    },
    pushPassenger: (state) => {
      if (state.passengers.length < 10) {
        state.passengers.push({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: undefined,
          email: "",
          phone: "",
          seats: [],
          meals: [],
          luggage: [],
        });
      }
    },
    popPassenger: (state) => {
      if (state.passengers.length > 1) state.passengers.pop();
    },
    setFirstName: (
      state,
      action: PayloadAction<{ firstName: string; index: number }>
    ) => {
      state.passengers[action.payload.index].firstName =
        action.payload.firstName;
    },
    setLastName: (
      state,
      action: PayloadAction<{ lastName: string; index: number }>
    ) => {
      state.passengers[action.payload.index].lastName = action.payload.lastName;
    },
    setDateOfBirth: (
      state,
      action: PayloadAction<{ dateOfBirth: string; index: number }>
    ) => {
      state.passengers[action.payload.index].dateOfBirth =
        action.payload.dateOfBirth;
    },
    setGender: (
      state,
      action: PayloadAction<{ gender: "male" | "female"; index: number }>
    ) => {
      state.passengers[action.payload.index].gender = action.payload.gender;
    },
    setEmail: (
      state,
      action: PayloadAction<{ email: string; index: number }>
    ) => {
      state.passengers[action.payload.index].email = action.payload.email;
    },
    setPhone: (
      state,
      action: PayloadAction<{ phone: string; index: number }>
    ) => {
      state.passengers[action.payload.index].phone = action.payload.phone;
    },
    addSeat: (
      state,
      action: PayloadAction<{ seat: AdditionalOption; index: number }>
    ) => {
      const { seat, index } = action.payload;
      const passenger = state.passengers[index];

      if (!passenger) return;

      const seatIndex = passenger.seats.findIndex(
        (item) => item.flight.id === seat.flight.id
      );

      if (seatIndex !== -1) {
        passenger.seats[seatIndex] = seat;
      } else {
        passenger.seats.push(seat);
      }

      state.price = calculateTotalPrice(state);
    },
    removeSeat: (
      state,
      action: PayloadAction<{ seatFlight: string; index: number }>
    ) => {
      const { seatFlight, index } = action.payload;
      const passenger = state.passengers[index];

      if (!passenger) return;

      passenger.seats = passenger.seats.filter(
        (item) => item.flight.id !== seatFlight
      );

      state.price = calculateTotalPrice(state);
    },
    addMeal: (
      state,
      action: PayloadAction<{ meal: AdditionalOption; index: number }>
    ) => {
      const { meal, index } = action.payload;
      const passenger = state.passengers[index];

      if (!passenger) return;

      const existingMeal = passenger.meals.find(
        (item) =>
          item.flight.id === action.payload.meal.flight.id &&
          item.name === action.payload.meal.name
      );

      if (existingMeal) {
        existingMeal.quantity! += 1;
      } else {
        passenger.meals.push({ ...meal, quantity: 1 });
      }

      state.price = calculateTotalPrice(state);
    },
    removeMeal: (
      state,
      action: PayloadAction<{ meal: AdditionalOption; index: number }>
    ) => {
      const { index } = action.payload;
      const passenger = state.passengers[index];

      if (!passenger) return;

      const existingMeal = passenger.meals.find(
        (item) =>
          item.flight.id === action.payload.meal.flight.id &&
          item.name === action.payload.meal.name
      );

      if (existingMeal) {
        if (existingMeal.quantity! > 1) {
          existingMeal.quantity! -= 1;
        } else {
          passenger.meals = passenger.meals.filter(
            (item) =>
              item.name !== action.payload.meal.name &&
              item.flight.id !== action.payload.meal.flight.id
          );
        }
      }

      state.price = calculateTotalPrice(state);
    },
    addLuggage: (
      state,
      action: PayloadAction<{ luggage: AdditionalOption; index: number }>
    ) => {
      const { luggage, index } = action.payload;
      const passenger = state.passengers[index];

      if (!passenger) return;

      const luggageIndex = passenger.luggage.findIndex(
        (item) => item.flight.id === luggage.flight.id
      );

      if (luggageIndex !== -1) {
        passenger.luggage[luggageIndex] = luggage;
      } else {
        passenger.luggage.push(luggage);
      }

      state.price = calculateTotalPrice(state);
    },
    removeLuggage: (
      state,
      action: PayloadAction<{ luggage: AdditionalOption; index: number }>
    ) => {
      const { luggage, index } = action.payload;
      const passenger = state.passengers[index];

      if (!passenger) return;

      passenger.luggage = passenger.luggage.filter(
        (item) => item.flight.id !== luggage.flight.id
      );

      state.price = calculateTotalPrice(state);
    },
    setContact: (state, action: PayloadAction<string>) => {
      state.contact = action.payload;
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
    setError: (state, action) => {
      const { index, field, message } = action.payload;
      if (!state.errors[index]) state.errors[index] = {};
      state.errors[index][field] = message;
    },
    clearError: (state, action) => {
      const { index, field } = action.payload;
      if (state.errors[index]) {
        delete state.errors[index][field];
      }
    },
    validatePassengerInfo: (state) => {
      state.passengerInfoValid =
        state.passengers.every(
          (item) =>
            item.firstName &&
            item.firstName !== "" &&
            item.lastName &&
            item.lastName !== "" &&
            item.dateOfBirth &&
            item.dateOfBirth !== "" &&
            item.gender &&
            item.email &&
            item.email !== "" &&
            item.phone &&
            item.phone !== ""
        ) &&
        state.contact !== undefined &&
        state.contact !== "";
    },
  },
});

export const {
  updateBooking,
  pushPassenger,
  popPassenger,
  setTripType,
  resetBooking,
  setGoingFlights,
  setReturningFlights,
  removeFlights,
  setPassengers,
  setFirstName,
  setLastName,
  setDateOfBirth,
  setGender,
  setEmail,
  setPhone,
  addSeat,
  removeSeat,
  addMeal,
  removeMeal,
  addLuggage,
  removeLuggage,
  setContact,
  setPrice,
  setError,
  clearError,
  validatePassengerInfo,
} = bookingSlice.actions;

export default bookingSlice.reducer;
