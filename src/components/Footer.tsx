"use client";
import { validatePassengerInfo } from "@/lib/features/bookingSlice";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { setBookingState, setSearchState } from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { extractTime, formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const bookingMap = [
  {
    path: "/booking/availability",
    next: "/booking/passenger-info",
  },
  {
    path: "/booking/passenger-info",
    next: "/booking/seat-selection",
  },
  {
    path: "/booking/seat-selection",
    next: "/booking/additional-services",
  },
  {
    path: "/booking/additional-services",
    next: "/booking/payment-info",
  },
];

const Footer = () => {
  const [expand, setExpand] = useState(false);

  const bookingState = useSelector((state: RootState) => state.booking);
  const searchState = useSelector((state: RootState) => state.search);

  const { passengers, flights, passengerInfoValid, contact, price } =
    bookingState;
  // const { returning } = searchState;

  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const prevBooking = getBookingState();
  //   dispatch(updateBooking(prevBooking));
  // }, []);

  useEffect(() => {
    path === "/booking/passenger-info" && dispatch(validatePassengerInfo());
  }, [passengers, contact, path]);

  const { loading } = useSelector((state: RootState) => state.loader);

  return (
    <footer className="bg-[#0b2351] text-white sticky bottom-0 z-20">
      <div className="flex flex-col w-full max-w-[1140px] 2xl:max-w-[1440px] mx-auto px-4">
        {expand && (
          <div className="flex flex-row items-start max-h-[300px] overflow-y-scroll scrollbar-hide gap-20 py-6 border-b-[1px] border-b-blue-900">
            <div className="flex flex-col gap-3">
              <h3>Flights</h3>
              <ol className="flex flex-col gap-1">
                {[...flights.going, ...flights.returning].map((item, index) => (
                  <li
                    className="flex flex-row items-center gap-2"
                    key={index}
                  >
                    <span>{item.flight.from.city}</span>
                    <ArrowRight
                      size={16}
                      color="white"
                    />
                    <span>{item.flight.to.city}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-3">
              <h3>Passengers</h3>
              <ol className="flex flex-col gap-2">
                {passengers.map((passenger, index) => (
                  <li
                    className="flex flex-col gap-1"
                    key={index}
                  >
                    <span className="font-medium">
                      {passenger.firstName + " " + passenger.lastName}
                    </span>
                    {(passenger.meals?.length > 0 ||
                      passenger.luggage?.length > 0 ||
                      passenger.seats?.length > 0) && (
                      <ol className="text-sm ml-1">
                        {[
                          ...passenger.meals,
                          ...passenger.luggage,
                          ...passenger.seats,
                        ].map((item, index) => (
                          <li key={index}>
                            {item.name} on {item.flight.from.city} -{" "}
                            {item.flight.to.city}, {item.price.toFixed(2)} EUR
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        <div className="flex flex-row items-center max-md:items-end justify-between py-6">
          <div className="flex flex-col items-start">
            {flights.going.length > 0 && (
              <>
                <span className="font-semibold max-md:text-sm">Departure</span>
                <span className="font-medium max-md:text-xs text-sm">
                  {flights.going[0].flight.from.airport.id} -{" "}
                  {flights.going[flights.going.length - 1].flight.to.airport.id}{" "}
                  • {formatDate(new Date(flights.going[0].flight.departure))}
                </span>
                <span className="font-light max-md:text-xs text-sm max-md:hidden">
                  Departure:{" "}
                  {extractTime(new Date(flights.going[0].flight.departure))} |
                  Arrival:{" "}
                  {extractTime(new Date(flights.going[0].flight.arrival))}
                </span>
                <span className="font-light max-md:text-xs text-sm md:hidden">
                  Departure:{" "}
                  {extractTime(new Date(flights.going[0].flight.departure))}
                  <br />
                  Arrival:{" "}
                  {extractTime(new Date(flights.going[0].flight.arrival))}
                </span>
              </>
            )}
            <button
              onClick={() => setExpand((prev) => !prev)}
              className="font-medium max-md:text-xs text-sm text-blue-300"
            >
              More Details
            </button>
          </div>
          <div className="flex flex-col items-end md:flex-row md:items-center gap-4">
            <div className="order-2 md:order-1 flex flex-col items-end">
              <span className="text-xl font-semibold text-right">
                <span className="text-sm font-light">EUR</span>{" "}
                {price.toFixed(2)}
              </span>
              <span className="text-xs text-blue-100 text-right">
                Total amount for {passengers.length} passenger
                {passengers.length > 1 && "s"}
              </span>
            </div>
            {path !== "/booking/payment-info" && (
              <button
                disabled={
                  (!passengerInfoValid && path === "/booking/passenger-info") ||
                  (flights.going.length < 1 &&
                    path === "/booking/availability") ||
                  loading
                }
                onClick={() => {
                  setBookingState(bookingState);
                  setSearchState(searchState);
                  dispatch(setLoadingState(true));
                  router.push(
                    bookingMap.find((item) => item.path === path)!.next
                  );
                }}
                data-test="footer-continue"
                className="order-3 md:order-2 max-md:px-8 px-12 max-md:py-2 py-3 rounded-lg max-md:text-sm text-lg bg-blue-500 font-semibold disabled:opacity-50"
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
