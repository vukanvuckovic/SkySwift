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

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 py-6 md:py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Payment Summary</h2>
        <p className="text-sm text-slate-400">Review your booking before completing payment.</p>
      </div>

      {/* Flight previews */}
      <div className="flex flex-col gap-3">
        {flights?.going?.map((flightObject: BookingFlight, index: number) => (
          <PreviewCard key={index} flightInfo={[flightObject]} direction="going" nonremoveable />
        ))}
        {flights?.returning?.map((flightObject: BookingFlight, index: number) => (
          <PreviewCard key={index} flightInfo={[flightObject]} direction="returning" nonremoveable />
        ))}
      </div>

      {/* Payment form + passenger summary */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <PaymentForm className="order-2 md:order-1" />
        <div className="flex-1 flex flex-col gap-3 order-1 md:order-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Passengers</p>
          {passengers?.map((item: Passenger, index: number) => (
            <PassengerInfoCard key={index} passenger={item} preview />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
