"use client";
import PreviewCard from "@/components/FlightCards/PreviewCard";
import { BookingState } from "@/lib/features/bookingSlice";
import { extractTime, formatDate } from "@/lib/utils";
import { ArrowRight, ArrowLeftRight, Calendar, Mail, Users } from "lucide-react";
import React from "react";

const BookingCard = ({ booking }: { booking: BookingState }) => {
  const origin = booking.flights.going[0].flight.from.city;
  const destination =
    booking.flights.going[booking.flights.going.length - 1].flight.to.city;
  const isRoundTrip = booking.tripType === "returning";

  return (
    <div
      data-test="booking-status-card"
      className="flex flex-col gap-6 py-5 px-4 md:px-6 rounded-2xl border border-slate-100 shadow-card bg-white"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              {origin}
            </h2>
            {isRoundTrip ? (
              <ArrowLeftRight size={18} className="text-sky-500" />
            ) : (
              <ArrowRight size={18} className="text-sky-500" />
            )}
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              {destination}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            #{booking.id}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-emerald-700">Active</span>
        </div>
      </div>

      {/* Flights */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Flights</p>
        <div className="flex flex-col gap-3">
          <PreviewCard flightInfo={booking.flights.going} direction="going" nonremoveable />
          {booking.flights.returning.length > 0 && (
            <PreviewCard flightInfo={booking.flights.returning} direction="returning" nonremoveable />
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passengers */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Passengers
            </p>
          </div>
          <ol className="flex flex-col gap-4">
            {booking.passengers.map((passenger, index) => (
              <li key={index} className="flex flex-col gap-1.5">
                <span className="font-semibold text-sm text-slate-800">
                  {passenger.firstName} {passenger.lastName}
                </span>
                {[...passenger.seats, ...passenger.meals, ...passenger.luggage].length > 0 && (
                  <ul className="flex flex-col gap-1 ml-1">
                    {[...passenger.seats, ...passenger.meals, ...passenger.luggage].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                        {item.quantity && item.quantity > 1 && (
                          <span className="font-semibold">{item.quantity}×</span>
                        )}
                        <span>{item.name} on</span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                          {item.flight.from.city}
                          <ArrowRight size={10} />
                          {item.flight.to.city}
                        </span>
                        <span className="font-semibold text-slate-700">{item.price} EUR</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Dates + contact */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Dates</p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-slate-600">
              <span>
                Departure:{" "}
                <span className="font-semibold text-slate-800">
                  {formatDate(new Date(booking.flights.going[0].flight.departure))},{" "}
                  {extractTime(new Date(booking.flights.going[0].flight.departure))}
                </span>
              </span>
              <span>
                Arrival:{" "}
                <span className="font-semibold text-slate-800">
                  {formatDate(new Date(booking.flights.going[booking.flights.going.length - 1].flight.arrival))},{" "}
                  {extractTime(new Date(booking.flights.going[booking.flights.going.length - 1].flight.arrival))}
                </span>
              </span>
              {isRoundTrip && booking.flights.returning.length > 0 && (
                <span>
                  Return:{" "}
                  <span className="font-semibold text-slate-800">
                    {formatDate(new Date(booking.flights.returning[booking.flights.returning.length - 1].flight.departure))},{" "}
                    {extractTime(new Date(booking.flights.returning[booking.flights.returning.length - 1].flight.departure))}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Contact</p>
            </div>
            <span className="text-sm text-slate-700">{booking.contact}</span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-sm font-medium text-slate-500">Total amount</span>
        <span className="text-xl font-bold text-slate-800">
          {booking.price.toFixed(2)}{" "}
          <span className="text-sm font-normal text-slate-400">EUR</span>
        </span>
      </div>
    </div>
  );
};

export default BookingCard;
