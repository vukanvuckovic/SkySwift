"use client";

import PreviewCard from "@/components/FlightCards/PreviewCard";
import PaymentForm from "@/components/PaymentForm";
import { getBookingState } from "@/lib/localStorage";
import React, { useEffect } from "react";
import PassengerInfoCard from "@/components/PassengerInfoCard";
import { useDispatch, useSelector } from "react-redux";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { RootState } from "@/lib/store";
import {
  BookingFlight,
  Passenger,
  updateBooking,
} from "@/lib/features/bookingSlice";
import { useRouter } from "next/navigation";

const PaymentInfo = () => {
  const { loading } = useSelector((state: RootState) => state.loader);

  const dispatch = useDispatch();
  const router = useRouter();

  const bookingState = useSelector((state: RootState) => state.booking);
  const { flights, passengers } = bookingState;

  useEffect(() => {
    if (!loading && !bookingState) {
      router.push("/");
    }
  }, [bookingState, loading]);

  useEffect(() => {
    const prevBooking = getBookingState();
    if (!prevBooking) {
      router.push("/");
    } else {
      dispatch(updateBooking(prevBooking));
      dispatch(setLoadingState(false));
    }
  }, [dispatch]);

  return (
    !loading && (
      <div className="flex flex-col max-md:py-6 py-8 max-md:gap-6 gap-8">
        <h2 className="max-md:text-lg">Payment Summary</h2>
        {flights?.going?.map((flightObject: BookingFlight, index: number) => (
          <PreviewCard
            key={index}
            flightInfo={[flightObject]}
            direction="going"
            nonremoveable
          />
        ))}
        {flights?.returning?.map(
          (flightObject: BookingFlight, index: number) => (
            <PreviewCard
              key={index}
              flightInfo={[flightObject]}
              direction="returning"
              nonremoveable
            />
          )
        )}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <PaymentForm className="order-2 md:order-1" />
          <div className="flex-1 flex flex-col gap-4 order-1 md:order-2">
            {passengers?.map((item: Passenger, index: number) => (
              <PassengerInfoCard
                key={index}
                passenger={item}
                preview
              />
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default PaymentInfo;
