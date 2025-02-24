import { Check, Loader, X } from "lucide-react";
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
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger hidden></DialogTrigger>
      <DialogContent className="w-full max-w-[600px] flex flex-col items-center p-6 gap-20">
        <DialogClose className="absolute top-4 right-4">
          <X
            size={16}
            color="gray"
          />
        </DialogClose>
        <div className="flex flex-col items-center">
          <DialogTitle
            data-test="booking-popup-title"
            className="max-md:text-xl text-3xl"
          >
            Congratulations!
          </DialogTitle>
          <DialogDescription className="max-md:text-sm text-lg">
            Your booking has been confirmed!
          </DialogDescription>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h3 className="max-md:text-base">Your reservation code is</h3>
          <h2 className="text-blue-500 max-md:text-xl text-3xl">{id}</h2>
          <span className="max-md:text-xs text-sm text-gray-500 text-center max-md:px-4 px-20">
            Save this code for later so you can check on updates, possible
            changes of flights, online check-in, and more!
          </span>
        </div>

        <div className="flex max-md:flex-col max-md:w-full md:items-center gap-2 self-end">
          <Link
            href={"/"}
            className="px-6 max-md:py-1.5 py-2 rounded-md border-[1px] border-blue-400 text-blue-500 max-md:text-xs text-sm text-center outline-none"
          >
            Back to home
          </Link>
          <button
            // onClick={async () => await handleVerify(id, contact)}
            onClick={async () => {
              const { data } = await verifyBooking({
                variables: {
                  bookingId: id,
                  contact: contact,
                },
              });
              if (data.verifyBooking) {
                return redirect("/booking-status");
              } else {
                toast.error("No booking found.");
              }
            }}
            className="px-6 max-md:py-1.5 py-2 rounded-md bg-blue-500 font-medium max-md:text-xs text-sm text-white outline-none"
          >
            Check booking information
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PaymentForm = ({ className }: { className?: string }) => {
  // const [loading, setLoading] = useState(false);
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

  const [postBooking, { data, loading, error }] = useMutation(POST_BOOKING);

  const paymentLogic = async () => {
    try {
      // setLoading(true);
      // const response = await fetch("http://localhost:3000/api/bookings", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     booking: bookingState,
      //   }),
      // });

      const preparedBooking = {
        // flights: bookingState.flights,
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
          seats: passenger.seats.map((seat) => ({
            ...seat,
            flight: seat.flight.id,
          })),
          meals: passenger.meals.map((meal) => ({
            ...meal,
            flight: meal.flight.id,
          })),
          luggage: passenger.luggage.map((luggageItem) => ({
            ...luggageItem,
            flight: luggageItem.flight.id,
          })),
        })),
        contact: bookingState.contact,
        price: bookingState.price,
        tripType: bookingState.tripType,
      };

      console.log("prepared booking in payment form", preparedBooking);

      const { data } = await postBooking({
        variables: {
          booking: preparedBooking,
        },
      });

      if (data.postBooking) {
        setBookingSuccessful({ status: true, id: data.postBooking.id });
        setPopupOpen(true);
        localStorage.removeItem("bookingState");
        localStorage.removeItem("searchState");
      } else {
        console.log("error, booking wasn't returned");
        toast.error("Error occurred.", { description: "Try again." });
        return;
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div
      className={
        "flex-1 h-fit flex flex-col gap-6 max-md:p-4 p-6 rounded-xl bg-white shadow-md shadow-gray-200 " +
        className
      }
    >
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        run={bookingSuccessful.status}
      />
      <SuccessPopup
        open={popupOpen}
        setOpen={setPopupOpen}
        id={bookingSuccessful.id!}
        contact={bookingState.contact}
      />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await paymentLogic();
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-row items-center justify-between">
          <h2 className="max-md:text-sm">Total {error?.message}</h2>
          <span className="font-medium max-md:text-base text-lg">
            {bookingState.price.toFixed(2)} EUR
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="text-[10px] text-gray-400"
            htmlFor="cardNumber"
          >
            Card Number
          </label>
          <input
            required
            data-test="card-number"
            className="p-1 border-b-[1px] border-gray-200 max-md:text-sm"
            name="cardNumber"
            placeholder="1234 5678 9101 1123"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="text-[10px] text-gray-400"
            htmlFor="cardHolder"
          >
            Card Holder
          </label>
          <input
            required
            data-test="card-holder"
            className="p-1 border-b-[1px] border-gray-200 max-md:text-sm"
            name="cardHolder"
            placeholder="John Doe"
            type="text"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <label
              className="text-[10px] text-gray-400"
              htmlFor="expiry"
            >
              Expiry
            </label>
            <input
              required
              data-test="card-expiry"
              className="flex-1 w-full p-1 border-b-[1px] border-gray-200 max-md:text-sm"
              name="expiry"
              placeholder="08/26"
              type="text"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label
              className="text-[10px] text-gray-400"
              htmlFor="cardNumber"
            >
              CVC
            </label>
            <input
              required
              data-test="card-cvc"
              className="flex-1 w-full p-1 border-b-[1px] border-gray-200 max-md:text-sm"
              name="cardNumber"
              placeholder="123"
              type="text"
            />
          </div>
        </div>
        <button
          data-test="payment-button"
          disabled={bookingSuccessful.status || loading}
          type="submit"
          className="flex justify-center items-center gap-2 max-md:py-1.5 py-2 rounded-md bg-blue-500 max-md:text-base text-lg font-medium text-white disabled:opacity-80"
        >
          {loading
            ? "Processing payment..."
            : bookingSuccessful.status
            ? "Paid"
            : "Pay"}
          {loading && (
            <Loader
              size={18}
              color="white"
              className="animate-spin"
            />
          )}
          {bookingSuccessful.status && (
            <Check
              size={18}
              color="white"
            />
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
