import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "@/lib/features/searchSlice";
import bookingReducer from "@/lib/features/bookingSlice";
import userReducer from "@/lib/features/userSlice";
import loaderReducer from "@/lib/features/loaderSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      booking: bookingReducer,
      search: searchReducer,
      user: userReducer,
      loader: loaderReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
