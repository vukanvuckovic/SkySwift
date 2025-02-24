import { flightClasses } from "@/constants/data";
import {
  Flight,
  setGoingFlights,
  setReturningFlights,
} from "@/lib/features/bookingSlice";
import { Check } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const FlightClasses = ({
  flightInfo,
  direction,
}: {
  flightInfo: Flight[];
  direction: "going" | "returning";
}) => {
  const connected = flightInfo.length > 1;

  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {flightClasses.map((flightClass: FlightClassFromData, index: number) => (
        <div
          key={index}
          className={`flex-1 flex flex-col gap-3 p-4 rounded-xl bg-white shadow-md shadow-gray-200 border-[1px] border-gray-200 border-l-[6px] border-l-blue-400`}
        >
          <h3>{flightClass.name}</h3>
          <ol className="flex-1 flex flex-col gap-2 text-xs text-gray-600 leading-tight">
            {flightClass.options.map((option: string, index: number) => (
              <li
                key={index}
                className="flex flex-row items-center gap-2"
              >
                <Check
                  size={14}
                  color="green"
                  className="flex-shrink-0"
                />
                {option}
              </li>
            ))}
          </ol>
          <button
            data-test="flight-class-button"
            onClick={() => {
              const flightObject = flightInfo.map((flight: Flight) => ({
                flight,
                flightClass: flightClass.name.toLowerCase() as FlightClassName,
                price:
                  flight.pricing?.[
                    flightClass.name.toLowerCase() as FlightClassName
                  ].price,
              }));

              dispatch(
                direction === "going"
                  ? setGoingFlights(flightObject)
                  : setReturningFlights(flightObject)
              );
              toast.success("Flight Added.");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-lg border-[1px] border-gray-200 py-2 mt-6 text-sm font-medium"
          >
            {(
              flightInfo[0].pricing?.[
                flightClass.name.toLowerCase() as FlightClassName
              ].price +
              (connected
                ? flightInfo[1].pricing?.[
                    flightClass.name.toLowerCase() as FlightClassName
                  ].price
                : 0)
            ) //reducer
              .toFixed(2)}{" "}
            EUR
          </button>
        </div>
      ))}
    </div>
  );
};

export default FlightClasses;
