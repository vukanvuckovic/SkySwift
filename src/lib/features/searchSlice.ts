import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  from: {
    city: string;
    airport: {
      name: string;
      id: string;
    };
  };
  to: {
    city: string;
    airport: {
      name: string;
      id: string;
    };
  };
  returning: boolean;
  departureDate: string;
  returningDate: string;
  passengers: number;
}

const initialState: SearchState = {
  from: {
    city: "",
    airport: {
      name: "",
      id: "",
    },
  },
  to: {
    city: "",
    airport: {
      name: "",
      id: "",
    },
  },
  returning: false,
  departureDate: "",
  returningDate: "",
  passengers: 1,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearch: (state) => {
      Object.assign(state, initialState);
    },
    updateSearch: (state, action: PayloadAction<SearchState>) => {
      Object.assign(state, action.payload);
    },
    setFrom: (
      state,
      action: PayloadAction<{
        city: string;
        airport: {
          name: string;
          id: string;
        };
      }>
    ) => {
      state.from = {
        city: action.payload.city,
        airport: action.payload.airport,
      };
    },
    setTo: (
      state,
      action: PayloadAction<{
        city: string;
        airport: {
          name: string;
          id: string;
        };
      }>
    ) => {
      state.to = {
        city: action.payload.city,
        airport: action.payload.airport,
      };
    },
    setReturning: (state, action: PayloadAction<boolean>) => {
      state.returning = action.payload;
    },
    setDepartureDate: (state, action: PayloadAction<string>) => {
      state.departureDate = action.payload;
    },
    setReturningDate: (state, action: PayloadAction<string>) => {
      state.returningDate = action.payload;
    },
    setPassengers: (state, action: PayloadAction<number>) => {
      state.passengers = action.payload;
    },
    incrementPassengers: (state) => {
      state.passengers =
        state.passengers < 10 ? (state.passengers += 1) : state.passengers;
    },
    decrementPassengers: (state) => {
      state.passengers =
        state.passengers > 1 ? (state.passengers -= 1) : state.passengers;
    },
  },
});

export const {
  setFrom,
  updateSearch,
  resetSearch,
  setTo,
  setReturning,
  setDepartureDate,
  setReturningDate,
  setPassengers,
  incrementPassengers,
  decrementPassengers,
} = searchSlice.actions;

export default searchSlice.reducer;
