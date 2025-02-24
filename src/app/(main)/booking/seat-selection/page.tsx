"use client";
import AirplaneModel from "@/components/AirplaneModel";
import { airplaneData } from "@/constants/data";
import { SeatContext } from "@/context/seatContext";
import {
  BookingFlight,
  Flight,
  Passenger,
  removeSeat,
  updateBooking,
} from "@/lib/features/bookingSlice";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { getBookingState } from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { extractTime, formatDate } from "@/lib/utils";
import { Airplane, ArrowDown2 } from "iconsax-react";
import { ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const FlightCard = ({ flight }: { flight: Flight }) => {
  const [passengersOpen, setPassengersOpen] = useState(false);

  const { passengers } = useSelector((state: RootState) => state.booking);

  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <div className="max-md:h-10 h-12 aspect-square rounded-full border-[1px] border-gray-200 bg-gray-50 flex justify-center items-center">
            <Airplane
              size={18}
              color="blue"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="max-md:!text-sm">
              {flight.from.city} - {flight.to.city}
            </h3>
            <span className="max-md:text-xs">
              {formatDate(new Date(flight.departure))},{" "}
              {extractTime(new Date(flight.departure))}
            </span>
          </div>
        </div>
        <button
          onClick={() => setPassengersOpen((prev) => !prev)}
          className="h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center"
        >
          <ArrowDown2
            size={16}
            color="blue"
          />
        </button>
      </div>
      {passengersOpen && (
        <div className="flex flex-col gap-4 px-2">
          {passengers.map((passenger, index) => {
            const seat = passenger.seats.find(
              (item) => item.flight.id === flight.id //???????????????
            );
            return (
              <div
                key={index}
                className="flex flex-row items-center justify-between"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="max-md:!text-sm leading-none text-base">
                    {passenger.firstName + " " + passenger.lastName}
                  </h3>

                  {/* seat name  */}
                  <span className="leading-none max-md:text-[10px] text-xs text-gray-500">
                    {seat ? seat.name : "No seat selected"}
                  </span>
                </div>

                {/* seat price  */}
                <div className="flex items-center gap-2">
                  <span className="max-md:text-xs text-sm text-gray-600 font-medium">
                    {seat ? seat.price : "0.00"} EUR
                  </span>
                  {seat && (
                    <button
                      onClick={() => {
                        dispatch(
                          removeSeat({
                            seatFlight: flight.id,
                            index: passengers.findIndex(
                              (item) => item.email === passenger.email
                            ),
                          })
                        );
                        toast.success("Seat removed.");
                      }}
                    >
                      <X
                        size={14}
                        color="red"
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SeatSelection = () => {
  const { loading } = useSelector((state: RootState) => state.loader);
  const bookingState = useSelector((state: RootState) => state.booking);
  const { flights } = bookingState;

  const [selectedPassenger, setSelectedPassenger] = useState<Passenger>();
  const [selectedFlight, setSelectedFlight] = useState<BookingFlight>();

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const prevBooking = getBookingState();
    if (!prevBooking) {
      router.push("/");
    } else {
      setSelectedPassenger(prevBooking.passengers[0]);
      setSelectedFlight(prevBooking.flights.going[0]);
      dispatch(updateBooking(prevBooking));
      dispatch(setLoadingState(false));
    }
  }, []);

  useEffect(() => {
    if (!loading && !bookingState) {
      router.push("/");
    }
  }, [bookingState, loading]);

  if (loading || !selectedPassenger || !selectedFlight) return;

  return (
    <SeatContext.Provider
      value={{
        selectedFlight,
        setSelectedFlight,
        selectedPassenger,
        setSelectedPassenger,
      }}
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 flex flex-col py-6 gap-6 h-fit max-h-[100dvh] lg:pb-[50dvh] overflow-y-scroll px-1 lg:sticky top-0 scrollbar-hide">
          <h2 className="max-md:!text-lg">Seat selection</h2>
          {flights.going.length > 0 && (
            <div className="flex-shrink-0 flex flex-col rounded-t-xl rounded-b-lg shadow-md shadow-gray-200 overflow-hidden">
              <div className="flex flex-row items-center gap-2 px-4 h-12 bg-blue-900 text-white">
                <span className="max-md:text-sm">
                  {flights.going[0].flight.from.city} (
                  {flights.going[0].flight.from.airport.id})
                </span>
                <ArrowRight
                  size={14}
                  color="white"
                />
                <span className="max-md:text-sm">
                  {flights.going[flights.going.length - 1].flight.to.city} (
                  {flights.going[flights.going.length - 1].flight.to.airport.id}
                  )
                </span>
              </div>
              {flights.going.map((item: BookingFlight, index: number) => (
                <FlightCard
                  flight={item.flight}
                  key={index}
                />
              ))}
            </div>
          )}
          {flights.returning.length > 0 && (
            <div className="flex-shrink-0 flex flex-col rounded-t-xl rounded-b-lg shadow-md shadow-gray-200 overflow-hidden">
              <div className="flex flex-row items-center gap-2 px-4 h-12 bg-blue-900 text-white">
                <span className="max-md:text-sm">
                  {flights.returning[0].flight.from.city} (
                  {flights.returning[0].flight.from.airport.id})
                </span>
                <ArrowRight
                  size={14}
                  color="white"
                />
                <span className="max-md:text-sm">
                  {
                    flights.returning[flights.returning.length - 1].flight.to
                      .city
                  }{" "}
                  (
                  {
                    flights.returning[flights.returning.length - 1].flight.to
                      .airport.id
                  }
                  )
                </span>
              </div>
              {flights.returning.map((item: BookingFlight, index: number) => (
                <FlightCard
                  flight={item.flight}
                  key={index}
                />
              ))}
            </div>
          )}
        </div>
        <AirplaneModel
          airplaneData={
            selectedFlight ? selectedFlight.flight.plane : airplaneData
          }
        />
      </div>
    </SeatContext.Provider>
  );
};

export default SeatSelection;
