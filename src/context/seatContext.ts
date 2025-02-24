import { BookingFlight, Passenger } from "@/lib/features/bookingSlice";
import { createContext } from "react";

export const SeatContext = createContext<
  | {
      selectedPassenger: Passenger;
      setSelectedPassenger: Function;
      selectedFlight: BookingFlight;
      setSelectedFlight: Function;
    }
  | undefined
>(undefined);
