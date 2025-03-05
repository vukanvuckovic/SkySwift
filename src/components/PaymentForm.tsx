import { Check, CreditCard, Loader, X } from "lucide-react";
import React, { useState } from "react";
import ReactConfetti from "react-confetti";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Link from "next/link";
import { toast } from "sonner";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { redirect } from "next/navigation";

const SuccessPopup = ({
  open,
  setOpen,
  id,
  contact,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  contact: string;
}) => {
  const VERIFY_BOOKING = gql`
    mutation VerifyBooking($bookingId: String!, $contact: String!) {
      verifyBooking(bookingId: $bookingId, contact: $contact)
    }
  `;

  const [verifyBooking] = useMutation(VERIFY_BOOKING);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger hidden />
      <DialogContent className="w-full max-w-[520px] flex flex-col items-center p-8 gap-8 rounded-2xl">
        <DialogClose className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors">
          <X size={16} className="text-slate-400" />
        </DialogClose>

        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <Check size={28} className="text-emerald-600" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <DialogTitle data-test="booking-popup-title" className="text-2xl md:text-3xl font-bold text-slate-800">
            Booking Confirmed!
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm max-w-sm">
            Your flight has been successfully booked. Save your reservation code below.
          </DialogDescription>
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Your reservation code
          </p>
          <div className="px-6 py-3 bg-sky-50 border border-sky-200 rounded-xl">
            <span className="text-sky-600 font-mono text-xl md:text-2xl font-bold tracking-wider">{id}</span>
          </div>
          <p className="text-xs text-slate-400 text-center max-w-xs">
            Save this code — you can use it to check flight updates, manage your booking, and check in online.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:justify-end">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm text-center hover:border-slate-300 hover:bg-slate-50 transition-colors outline-none"
          >
            Back to home
          </Link>
          <button
            onClick={async () => {
              const { data } = await verifyBooking({
                variables: { bookingId: id, contact },
              });
              if (data.verifyBooking) {
                return redirect("/booking-status");
              } else {
                toast.error("Booking not found.");
              }
            }}
            className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 font-semibold text-sm text-white transition-colors outline-none"
          >
            View booking details
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PaymentForm = ({ className }: { className?: string }) => {
  const [bookingSuccessful, setBookingSuccessful] = useState({
    status: false,
    id: "",
  });
  const [popupOpen, setPopupOpen] = useState(false);

  const bookingState = useSelector((state: RootState) => state.booking);

  const POST_BOOKING = gql`
    mutation PostBooking($booking: BookingInput!) {
      postBooking(booking: $booking) {
        id
        contact
        price
      }
    }
  `;

  const [postBooking, { loading }] = useMutation(POST_BOOKING);

  const paymentLogic = async () => {
    try {
      const preparedBooking = {
        flights: {
          going: bookingState.flights.going.map((item) => ({
            ...item,
            flight: item.flight.id,
          })),
          returning: bookingState.flights.returning.map((item) => ({
            ...item,
            flight: item.flight.id,
          })),
        },
        passengers: bookingState.passengers.map((passenger) => ({
          ...passenger,
          seats: passenger.seats.map((seat) => ({ ...seat, flight: seat.flight.id })),
          meals: passenger.meals.map((meal) => ({ ...meal, flight: meal.flight.id })),
          luggage: passenger.luggage.map((item) => ({ ...item, flight: item.flight.id })),
        })),
        contact: bookingState.contact,
        price: bookingState.price,
        tripType: bookingState.tripType,
      };

      const { data } = await postBooking({ variables: { booking: preparedBooking } });

      if (data.postBooking) {
        setBookingSuccessful({ status: true, id: data.postBooking.id });
        setPopupOpen(true);
        localStorage.removeItem("bookingState");
        localStorage.removeItem("searchState");
      } else {
        toast.error("Booking failed.", { description: "Please try again." });
      }
    } catch {
      toast.error("Something went wrong.", { description: "Please try again." });
    }
  };

  const inputClass =
    "w-full border-b border-slate-200 focus:border-sky-400 bg-transparent py-2 text-sm outline-none transition-colors duration-150 placeholder:text-slate-300";
  const labelClass = "text-[11px] font-semibold text-slate-400 uppercase tracking-wider";

  return (
    <div className={"flex-1 h-fit flex flex-col gap-5 p-5 md:p-6 rounded-xl bg-white border border-slate-100 shadow-card " + (className ?? "")}>
      <ReactConfetti
        width={typeof window !== "undefined" ? window.innerWidth : 800}
        height={typeof window !== "undefined" ? window.innerHeight : 600}
        run={bookingSuccessful.status}
      />
      <SuccessPopup
        open={popupOpen}
        setOpen={setPopupOpen}
        id={bookingSuccessful.id}
        contact={bookingState.contact}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-sky-600" />
          <h2 className="font-semibold text-slate-800">Payment Details</h2>
        </div>
        <span className="font-bold text-lg text-slate-800">
          {bookingState.price.toFixed(2)}{" "}
          <span className="text-sm font-normal text-slate-400">EUR</span>
        </span>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await paymentLogic();
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Card Number</label>
          <input
            required
            data-test="card-number"
            className={inputClass}
            name="cardNumber"
            placeholder="1234 5678 9101 1123"
            type="text"
            maxLength={19}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Card Holder</label>
          <input
            required
            data-test="card-holder"
            className={inputClass}
            name="cardHolder"
            placeholder="John Doe"
            type="text"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClass}>Expiry</label>
            <input
              required
              data-test="card-expiry"
              className={inputClass}
              name="expiry"
              placeholder="MM/YY"
              type="text"
              maxLength={5}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClass}>CVC</label>
            <input
              required
              data-test="card-cvc"
              className={inputClass}
              name="cvc"
              placeholder="•••"
              type="text"
              maxLength={4}
            />
          </div>
        </div>

        <button
          data-test="payment-button"
          disabled={bookingSuccessful.status || loading}
          type="submit"
          className="flex justify-center items-center gap-2 mt-2 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 font-semibold text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Processing…
            </>
          ) : bookingSuccessful.status ? (
            <>
              <Check size={16} />
              Paid
            </>
          ) : (
            `Pay ${bookingState.price.toFixed(2)} EUR`
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          This is a demo. No real payment is processed.
        </p>
      </form>
    </div>
  );
};

export default PaymentForm;
