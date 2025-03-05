import { setDepartureDate, setReturningDate } from "@/lib/features/searchSlice";
import { RootState } from "@/lib/store";
import { Calendar } from "lucide-react";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const DatePicker = ({
  type = "departure",
}: {
  type?: "departure" | "return";
}) => {
  const { departureDate, returningDate } = useSelector(
    (state: RootState) => state.search
  );
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const value = type === "departure" ? departureDate : returningDate;
  const hasValue = value !== "";

  return (
    <div
      data-test={type === "departure" ? "departure-date-trigger" : "return-date-trigger"}
      onMouseDown={() => inputRef.current?.showPicker()}
      className="flex-1 flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2.5 relative cursor-pointer hover:border-slate-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 transition-all duration-150 bg-slate-50 shadow-sm"
    >
      <Calendar size={18} className={hasValue ? "text-sky-500" : "text-slate-300"} />
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-slate-500 leading-none mb-0.5">
          {type === "departure" ? "Departure" : "Return"}
        </span>
        <span className={`text-sm font-semibold truncate ${hasValue ? "text-sky-600" : "text-slate-400"}`}>
          {value || "Select date"}
        </span>
      </div>
      <input
        data-test={type === "departure" ? "departure-date-picker" : "return-date-picker"}
        ref={inputRef}
        value={value}
        onChange={(e) =>
          type === "departure"
            ? dispatch(setDepartureDate(e.target.value))
            : dispatch(setReturningDate(e.target.value))
        }
        type="date"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default DatePicker;
