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

const CLASS_ACCENTS: Record<string, string> = {
  Basic: "border-l-slate-400",
  Ecojet: "border-l-sky-500",
  Flex: "border-l-emerald-500",
  Premium: "border-l-violet-500",
};

const CLASS_BADGE_COLORS: Record<string, string> = {
  Basic: "bg-slate-100 text-slate-600",
  Ecojet: "bg-sky-100 text-sky-700",
  Flex: "bg-emerald-100 text-emerald-700",
  Premium: "bg-violet-100 text-violet-700",
};

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {flightClasses.map((flightClass: FlightClassFromData) => {
        const price = (
          flightInfo[0].pricing?.[flightClass.name.toLowerCase() as FlightClassName].price +
          (connected
            ? (flightInfo[1]?.pricing?.[flightClass.name.toLowerCase() as FlightClassName]?.price ?? 0)
            : 0)
        ).toFixed(2);

        return (
          <div
            key={flightClass.name}
            className={`flex flex-col gap-3 p-4 rounded-xl bg-white border border-slate-100 border-l-4 shadow-sm hover:shadow-card transition-shadow duration-150 ${CLASS_ACCENTS[flightClass.name] ?? "border-l-slate-300"}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">{flightClass.name}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CLASS_BADGE_COLORS[flightClass.name] ?? "bg-slate-100 text-slate-600"}`}>
                {flightClass.name}
              </span>
            </div>

            <ul className="flex-1 flex flex-col gap-1.5">
              {flightClass.options.map((option: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-500 leading-snug">
                  <Check size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  {option}
                </li>
              ))}
            </ul>

            <button
              data-test="flight-class-button"
              onClick={() => {
                const flightObject = flightInfo.map((flight: Flight) => ({
                  flight,
                  flightClass: flightClass.name.toLowerCase() as FlightClassName,
                  price: flight.pricing?.[flightClass.name.toLowerCase() as FlightClassName].price,
                }));

                dispatch(
                  direction === "going"
                    ? setGoingFlights(flightObject)
                    : setReturningFlights(flightObject)
                );
                toast.success(`${flightClass.name} class selected.`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-2 w-full py-2 px-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-sm font-semibold text-slate-700 hover:text-sky-700 transition-all duration-150"
            >
              {price} EUR
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FlightClasses;
