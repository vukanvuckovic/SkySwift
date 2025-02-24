"use client";
import PreviewCard from "@/components/FlightCards/PreviewCard";
import { BookingState } from "@/lib/features/bookingSlice";
import { extractTime, formatDate } from "@/lib/utils";
import { ArrangeHorizontal, ArrowRight } from "iconsax-react";
import { Contact } from "lucide-react";
import React from "react";

const BookingCard = ({ booking }: { booking: BookingState }) => {
  return (
    <div
      data-test="booking-status-card"
      className="flex flex-col gap-10 py-4 px-4 md:px-6 max-md:rounded-lg rounded-xl shadow-md shadow-gray-200 bg-white"
    >
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="max-md:text-lg text-3xl">
              {booking.flights.going[0].flight.from.city}
            </h2>
            {booking.tripType === "returning" ? (
              <>
                <ArrangeHorizontal
                  size={24}
                  color="black"
                  className="max-md:hidden"
                />
                <ArrangeHorizontal
                  size={18}
                  color="black"
                  className="md:hidden"
                />
              </>
            ) : (
              <>
                <ArrowRight
                  size={24}
                  color="black"
                  className="max-md:hidden"
                />
                <ArrowRight
                  size={18}
                  color="black"
                  className="md:hidden"
                />
              </>
            )}
            <h2 className="max-md:text-lg text-3xl">
              {
                booking.flights.going[booking.flights.going.length - 1].flight
                  .to.city
              }
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            Booking number {booking.id}
          </span>
        </div>
        <div className="flex items-center max-md:gap-2 gap-3">
          <h3 className="max-md:text-xs">Active</h3>
          <div className="w-2 aspect-square rounded-full bg-green-400" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="max-md:text-sm">Flights</h3>
        <div className="flex flex-col gap-4">
          <PreviewCard
            flightInfo={booking.flights.going}
            direction="going"
            nonremoveable
          />
          {booking.flights.returning.length > 0 && (
            <PreviewCard
              flightInfo={booking.flights.returning}
              direction="returning"
              nonremoveable
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-4">
          <h3 className="max-md:text-sm">Passengers</h3>
          <ol className="flex flex-col gap-3">
            {booking.passengers.map((passenger, index) => (
              <li
                key={index}
                className="flex flex-col gap-2"
              >
                <span className="font-medium max-md:text-sm">
                  {passenger.firstName + " " + passenger.lastName}
                </span>
                <ol className="flex flex-col gap-2 max-md:text-xs text-sm text-gray-500 ml-1">
                  {[
                    ...passenger.seats,
                    ...passenger.meals,
                    ...passenger.luggage,
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <span className="max-md:text-sm">
                        {item.quantity && item.quantity > 1 && (
                          <span>{item.quantity}</span>
                        )}{" "}
                        {item.name} on{" "}
                      </span>
                      <div className="flex items-center gap-2 text-black py-1 px-2 rounded-md bg-gray-100">
                        <span className="max-md:text-sm">
                          {item.flight.from.city}
                        </span>
                        <ArrowRight
                          size={14}
                          color="black"
                        />
                        <span className="max-md:text-sm">
                          {item.flight.to.city}
                        </span>
                      </div>
                      <span className="font-semibold text-black">
                        {item.price} EUR
                      </span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h3 className="max-md:text-sm">Dates</h3>
            <div className="flex flex-col gap-1">
              <span className="max-md:text-xs">
                Departure on{" "}
                <span className="font-semibold">
                  {formatDate(
                    new Date(booking.flights.going[0].flight.departure)
                  )}
                  ,{" "}
                  {extractTime(
                    new Date(booking.flights.going[0].flight.departure)
                  )}
                </span>
              </span>
              <span className="max-md:text-xs">
                Arrival on{" "}
                <span className="font-semibold">
                  {formatDate(
                    new Date(
                      booking.flights.going[
                        booking.flights.going.length - 1
                      ].flight.arrival
                    )
                  )}
                  ,{" "}
                  {extractTime(
                    new Date(
                      booking.flights.going[
                        booking.flights.going.length - 1
                      ].flight.arrival
                    )
                  )}
                </span>
              </span>
              {booking.tripType === "returning" &&
                booking.flights.returning.length > 0 && (
                  <span className="max-md:text-xs">
                    Returning on{" "}
                    <span className="font-semibold">
                      {formatDate(
                        new Date(
                          booking.flights.returning[
                            booking.flights.returning.length - 1
                          ].flight.departure
                        )
                      )}
                      ,{" "}
                      {extractTime(
                        new Date(
                          booking.flights.returning[
                            booking.flights.returning.length - 1
                          ].flight.departure
                        )
                      )}
                    </span>
                  </span>
                )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="max-md:text-sm">Contact</h3>
            <div className="flex items-center gap-2">
              <Contact
                size={18}
                color="black"
              />
              <span className="max-md:text-xs">{booking.contact}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="max-md:text-sm">Total</h2>
        <span className="max-md:text-lg text-2xl font-semibold">
          {booking.price.toFixed(2)} EUR
        </span>
      </div>
    </div>
  );
};

export default BookingCard;
