"use client";
import { validatePassengerInfo } from "@/lib/features/bookingSlice";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { setBookingState, setSearchState } from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { extractTime, formatDate } from "@/lib/utils";
import { ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const bookingMap = [
  { path: "/booking/availability", next: "/booking/passenger-info" },
  { path: "/booking/passenger-info", next: "/booking/seat-selection" },
  { path: "/booking/seat-selection", next: "/booking/additional-services" },
  { path: "/booking/additional-services", next: "/booking/payment-info" },
];

const Footer = () => {
  const [expand, setExpand] = useState(false);

  const bookingState = useSelector((state: RootState) => state.booking);
  const searchState = useSelector((state: RootState) => state.search);
  const { passengers, flights, passengerInfoValid, contact, price } = bookingState;

  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (path === "/booking/passenger-info") {
      dispatch(validatePassengerInfo());
    }
  }, [passengers, contact, path]);

  const { loading } = useSelector((state: RootState) => state.loader);

  const isDisabled =
    (!passengerInfoValid && path === "/booking/passenger-info") ||
    (flights.going.length < 1 && path === "/booking/availability") ||
    loading;

  return (
    <footer className="bg-navy-900 text-white sticky bottom-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <div className="w-full max-w-[1140px] 2xl:max-w-[1440px] mx-auto px-4">

        {/* Expanded details */}
        {expand && (
          <div className="flex flex-row items-start max-h-[240px] overflow-y-scroll scrollbar-hide gap-12 py-5 border-b border-white/10 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Flights</p>
              <ol className="flex flex-col gap-1.5">
                {[...flights.going, ...flights.returning].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-300">
                    <span>{item.flight.from.city}</span>
                    <ArrowRight size={12} className="text-sky-400 flex-shrink-0" />
                    <span>{item.flight.to.city}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Passengers</p>
              <ol className="flex flex-col gap-2">
                {passengers.map((passenger, index) => (
                  <li key={index} className="flex flex-col gap-1">
                    <span className="font-medium text-white">
                      {passenger.firstName} {passenger.lastName}
                    </span>
                    {(passenger.meals?.length > 0 || passenger.luggage?.length > 0 || passenger.seats?.length > 0) && (
                      <ul className="text-xs text-slate-400 ml-2 flex flex-col gap-0.5">
                        {[...passenger.meals, ...passenger.luggage, ...passenger.seats].map((item, i) => (
                          <li key={i}>
                            {item.name} on {item.flight.from.city}–{item.flight.to.city} · {item.price.toFixed(2)} EUR
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Main footer bar */}
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Left: flight summary */}
          <div className="flex flex-col gap-0.5 min-w-0">
            {flights.going.length > 0 && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm truncate">
                    {flights.going[0].flight.from.airport.id}
                    {" – "}
                    {flights.going[flights.going.length - 1].flight.to.airport.id}
                  </span>
                  <span className="text-slate-400 text-xs">
                    · {formatDate(new Date(flights.going[0].flight.departure))}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {extractTime(new Date(flights.going[0].flight.departure))} → {" "}
                  {extractTime(new Date(flights.going[flights.going.length - 1].flight.arrival))}
                </span>
              </>
            )}
            <button
              onClick={() => setExpand((prev) => !prev)}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors mt-0.5 w-fit"
            >
              {expand ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
              {expand ? "Hide details" : "More details"}
            </button>
          </div>

          {/* Right: price + continue */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-lg md:text-xl font-bold">
                {price.toFixed(2)}{" "}
                <span className="text-sm font-normal text-slate-300">EUR</span>
              </span>
              <span className="text-xs text-slate-400">
                {passengers.length} passenger{passengers.length !== 1 && "s"}
              </span>
            </div>

            {path !== "/booking/payment-info" && (
              <button
                disabled={isDisabled}
                onClick={() => {
                  setBookingState(bookingState);
                  setSearchState(searchState);
                  dispatch(setLoadingState(true));
                  router.push(bookingMap.find((item) => item.path === path)!.next);
                }}
                data-test="footer-continue"
                className="px-6 md:px-10 py-2.5 md:py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
