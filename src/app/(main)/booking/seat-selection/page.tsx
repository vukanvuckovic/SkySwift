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
import { ArrowRight, ChevronDown, Plane, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const FlightCard = ({ flight }: { flight: Flight }) => {
  const [passengersOpen, setPassengersOpen] = useState(false);
  const { passengers } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-3 bg-white p-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-sky-100 bg-sky-50 flex items-center justify-center flex-shrink-0">
            <Plane size={16} className="text-sky-500" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm text-slate-800">
              {flight.from.city} → {flight.to.city}
            </h3>
            <span className="text-xs text-slate-400">
              {formatDate(new Date(flight.departure))}, {extractTime(new Date(flight.departure))}
            </span>
          </div>
        </div>
        <button
          onClick={() => setPassengersOpen((prev) => !prev)}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <ChevronDown
            size={14}
            className={`text-slate-500 transition-transform duration-200 ${passengersOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {passengersOpen && (
        <div className="flex flex-col gap-3 px-2 pt-1">
          {passengers.map((passenger, index) => {
            const seat = passenger.seats.find((item) => item.flight.id === flight.id);
            return (
              <div key={index} className="flex items-center justify-between py-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-slate-700">
                    {passenger.firstName} {passenger.lastName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {seat ? seat.name : "No seat selected"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {seat ? seat.price.toFixed(2) : "0.00"} EUR
                  </span>
                  {seat && (
                    <button
                      onClick={() => {
                        dispatch(
                          removeSeat({
                            seatFlight: flight.id,
                            index: passengers.findIndex((p) => p.email === passenger.email),
                          })
                        );
                        toast.success("Seat removed.");
                      }}
                      className="p-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <X size={13} className="text-red-400" />
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

const FlightGroupCard = ({
  flightList,
  label,
}: {
  flightList: BookingFlight[];
  label: string;
}) => (
  <div className="flex-shrink-0 flex flex-col rounded-xl border border-slate-100 shadow-card overflow-hidden">
    {/* Header */}
    <div className="flex items-center gap-2 px-4 h-11 bg-navy-900 text-white">
      <span className="text-xs font-bold uppercase tracking-wider text-sky-300">{label}</span>
      <span className="text-sm font-medium ml-1">
        {flightList[0].flight.from.city} ({flightList[0].flight.from.airport.id})
      </span>
      <ArrowRight size={13} className="text-sky-400" />
      <span className="text-sm font-medium">
        {flightList[flightList.length - 1].flight.to.city} ({flightList[flightList.length - 1].flight.to.airport.id})
      </span>
    </div>
    {flightList.map((item: BookingFlight, index: number) => (
      <FlightCard flight={item.flight} key={index} />
    ))}
  </div>
);

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

  if (loading || !selectedPassenger || !selectedFlight) return null;

  return (
    <SeatContext.Provider
      value={{ selectedFlight, setSelectedFlight, selectedPassenger, setSelectedPassenger }}
    >
      <div className="flex flex-col gap-4 py-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Seat Selection</h2>
          <p className="text-sm text-slate-400">Choose your preferred seats for each flight.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="flex-1 flex flex-col gap-4 h-fit max-h-[100dvh] lg:pb-[50dvh] overflow-y-auto px-0.5 lg:sticky top-0 scrollbar-hide">
            {flights.going.length > 0 && (
              <FlightGroupCard flightList={flights.going} label="Outbound" />
            )}
            {flights.returning.length > 0 && (
              <FlightGroupCard flightList={flights.returning} label="Return" />
            )}
          </div>

          {/* Airplane model */}
          <AirplaneModel
            airplaneData={selectedFlight ? selectedFlight.flight.plane : airplaneData}
          />
        </div>
      </div>
    </SeatContext.Provider>
  );
};

export default SeatSelection;
