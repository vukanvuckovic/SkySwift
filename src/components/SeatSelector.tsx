import { SeatContext } from "@/context/seatContext";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { addSeat } from "@/lib/features/bookingSlice";
import { RootState } from "@/lib/store";
import PassengerSelector from "./PassengerSelector";
import { toast } from "sonner";

const SeatSelector = ({
  children,
  seat,
}: {
  children: React.ReactNode;
  seat: {
    name: string;
    price: number;
  };
}) => {
  const seatInfo = useContext(SeatContext);
  if (!seatInfo) throw new Error("No Context");
  const { selectedFlight, selectedPassenger, setSelectedPassenger } = seatInfo;
  if (!selectedFlight || !selectedPassenger)
    throw new Error("No flight or passenger");

  const [popoverOpen, setPopoverOpen] = useState(false);

  const { passengers } = useSelector((state: RootState) => state.booking);

  const dispatch = useDispatch();

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit min-w-[250px] flex flex-col p-2 gap-2">
        <h3 className="py-1 px-2">Seat {seat.name}</h3>
        <PassengerSelector
          selectedPassenger={selectedPassenger}
          setSelectedPassenger={setSelectedPassenger}
        />
        <button
          data-test="add-seat-button"
          onClick={() => {
            dispatch(
              addSeat({
                seat: {
                  name: seat.name,
                  price: seat.price,
                  flight: selectedFlight.flight,
                },
                index: passengers.findIndex(
                  (item) => item.email === selectedPassenger.email
                ),
              })
            );
            toast.success("Seat Added.");
            setPopoverOpen(false);
          }}
          className="bg-blue-500 rounded-lg py-2 text-white font-medium text-sm"
        >
          Add
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default SeatSelector;
