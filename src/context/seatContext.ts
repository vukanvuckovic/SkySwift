import { BookingFlight, Passenger } from "@/lib/features/bookingSlice";
import { createContext } from "react";

export const SeatContext = createContext<
  | {
      selectedPassenger: Passenger;
      setSelectedPassenger: (passenger: Passenger) => void;
      selectedFlight: BookingFlight;
      setSelectedFlight: (flight: BookingFlight) => void;
    }
  | undefined
>(undefined);
