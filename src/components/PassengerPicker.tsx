import {
  decrementPassengers,
  incrementPassengers,
} from "@/lib/features/searchSlice";
import { RootState } from "@/lib/store";
import { Minus, Plus, Users } from "lucide-react";
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
        className="min-w-full flex items-center justify-between gap-8 px-4 py-3 rounded-xl bg-white border border-slate-100 shadow-xl"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm">Adults</span>
          <span className="text-xs text-slate-400">12+ years</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(decrementPassengers());
              dispatch(popPassenger());
            }}
            className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-sky-100 hover:text-sky-600 rounded-full transition-colors"
          >
            <Minus size={14} className="text-slate-600" />
          </button>
          <span className="w-6 text-center font-bold text-slate-800">{passengers}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(incrementPassengers());
              dispatch(pushPassenger());
            }}
            className="w-8 h-8 flex items-center justify-center bg-sky-600 hover:bg-sky-700 rounded-full transition-colors"
          >
            <Plus size={14} className="text-white" />
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
      <div className="flex-1 flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2.5 relative cursor-pointer hover:border-slate-300 focus-within:border-sky-400 transition-all duration-150 bg-slate-50 shadow-sm">
        <Users size={18} className={passengers > 1 ? "text-sky-500" : "text-slate-300"} />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-slate-500 leading-none mb-0.5">
            Passengers
          </span>
          <span className="text-sm font-semibold text-sky-600">
            {passengers} Passenger{passengers !== 1 && "s"}
          </span>
        </div>
      </div>
    </PassengerPopover>
  );
};

export default PassengerPicker;
