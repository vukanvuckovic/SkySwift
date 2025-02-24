import { Flight } from "@/lib/features/bookingSlice";
import { createContext } from "react";

export const SelectionContext = createContext<
  | {
      selectedPassenger: Passenger;
      setSelectedPassenger: Function;
      selectedFlight: Flight;
      setSelectedFlight: Function;
    }
  | undefined
>(undefined);
