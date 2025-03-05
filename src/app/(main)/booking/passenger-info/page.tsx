"use client";
import PassengerContactField from "@/components/PassengerContactField";
import PassengerForm from "@/components/PassengerForm";
import PassengerInfoSignIn from "@/components/PassengerInfoSignIn";
import { updateBooking } from "@/lib/features/bookingSlice";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { getBookingState } from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const PassengerInfo = () => {
  const bookingState = useSelector((state: RootState) => state.booking);
  const { passengers } = bookingState;
  const { loading } = useSelector((state: RootState) => state.loader);

  const dispatch = useDispatch();
  const router = useRouter();

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
  }, []);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 py-6 md:py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Passenger Information</h2>
        <p className="text-sm text-slate-400">Fill in the details for each traveller.</p>
      </div>

      {/* Sign in prompt */}
      <PassengerInfoSignIn />

      {/* Guest divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ChevronDown size={14} className="text-sky-400" />
          Continue as guest
        </div>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Passenger forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {passengers.map((passenger, index) => (
          <PassengerForm key={index} info={passenger} index={index} />
        ))}
        <PassengerContactField />
      </div>
    </div>
  );
};

export default PassengerInfo;
