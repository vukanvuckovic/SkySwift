"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BookingState } from "./bookingSlice";

export interface UserState {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bookings?: BookingState[];
  };
  loading: boolean;
}

const initialState: UserState = {
  user: undefined,
  loading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setUser, setLoading, resetUser } = userSlice.actions;

export default userSlice.reducer;
