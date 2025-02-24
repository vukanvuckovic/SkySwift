"use client";
import PassengerContactField from "@/components/PassengerContactField";
import PassengerForm from "@/components/PassengerForm";
import PassengerInfoSignIn from "@/components/PassengerInfoSignIn";
import { updateBooking } from "@/lib/features/bookingSlice";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { getBookingState } from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { ArrowDown2 } from "iconsax-react";
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

  if (loading) return;

  return (
    <div className="flex flex-col gap-8 py-8">
      <PassengerInfoSignIn />
      <div className="flex flex-row items-center gap-3">
        <div className="flex-1 h-[1px] bg-blue-200" />
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm text-gray-500">Contiune as guest</span>
          <ArrowDown2
            size={16}
            color="#3b82f6"
          />
        </div>
        <div className="flex-1 h-[1px] bg-blue-200" />
      </div>
      <h2>Passenger Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {passengers.map((passenger, index) => (
          <PassengerForm
            info={passenger}
            index={index}
            key={index}
          />
        ))}
        <PassengerContactField />
      </div>
    </div>
  );
};

export default PassengerInfo;
