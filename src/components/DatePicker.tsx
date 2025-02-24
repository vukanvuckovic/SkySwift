import { setDepartureDate, setReturningDate } from "@/lib/features/searchSlice";
import { RootState } from "@/lib/store";
import { Calendar1 } from "lucide-react";
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
  return (
    <div
      data-test={
        type === "departure" ? "departure-date-trigger" : "return-date-trigger"
      }
      onMouseDown={() => inputRef.current?.showPicker()}
      className="flex-1 flex flex-row items-center gap-3 border-[1px] border-gray-200 rounded-lg px-4 py-3 relative"
    >
      <Calendar1
        size={24}
        color="gray"
      />
      <div className="flex flex-col">
        <span className="max-md:text-sm font-medium text-gray-500 leading-none">
          {type === "departure" ? "Departure" : "Return"}
        </span>
        <span className="max-md:text-xs text-sm text-gray-400">
          {type === "departure"
            ? departureDate || "Please select"
            : returningDate || "Please select"}
        </span>
        <input
          data-test={
            type === "departure"
              ? "departure-date-picker"
              : "return-date-picker"
          }
          ref={inputRef}
          value={type === "departure" ? departureDate : returningDate}
          onChange={(val) =>
            type === "departure"
              ? dispatch(setDepartureDate(val.target.value))
              : dispatch(setReturningDate(val.target.value))
          }
          type="date"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default DatePicker;
