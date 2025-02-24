import {
  decrementPassengers,
  incrementPassengers,
} from "@/lib/features/searchSlice";
import { RootState } from "@/lib/store";
import { Minus, Profile } from "iconsax-react";
import { Plus } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { popPassenger, pushPassenger } from "@/lib/features/bookingSlice";

const PassengerPopover = ({ children }: { children: React.ReactNode }) => {
  const { passengers } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="top"
        className="min-w-full flex flex-row items-center justify-between gap-10 px-4 py-3 rounded-[10px] bg-white border-[1px] border-gray-200 shadow-md shadow-gray-200"
      >
        <div className="flex flex-col">
          <h3 className="text-base">Adults</h3>
          <span className="text-sm text-gray-500">12+</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(decrementPassengers());
              dispatch(popPassenger());
            }}
            className="h-8 aspect-square flex justify-center items-center bg-blue-500 rounded-full"
          >
            <Minus
              size={16}
              color="white"
            />
          </button>
          <span>{passengers}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(incrementPassengers());
              dispatch(pushPassenger());
            }}
            className="h-8 aspect-square flex justify-center items-center bg-blue-500 rounded-full"
          >
            <Plus
              size={16}
              color="white"
            />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const PassengerPicker = () => {
  const { passengers } = useSelector((state: RootState) => state.search);

  return (
    <PassengerPopover>
      <div className="flex-1 flex flex-row items-center gap-3 border-[1px] border-gray-200 rounded-lg px-4 py-3 relative cursor-pointer">
        <Profile
          size={24}
          color="gray"
        />
        <div className="flex flex-col">
          <span className="max-md:text-sm font-medium text-gray-500 leading-none">
            Passengers
          </span>
          <span className="max-md:text-xs text-sm font-medium text-blue-400">
            {passengers} Passenger{passengers > 1 && "s"}
          </span>
        </div>
      </div>
    </PassengerPopover>
  );
};

export default PassengerPicker;
