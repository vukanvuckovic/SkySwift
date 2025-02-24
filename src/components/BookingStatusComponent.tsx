import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

const FormContent = () => {
  const [bookingInfo, setBookingInfo] = useState({
    id: "",
    contact: "vukan@gmail.com",
  });

  const VERIFY_BOOKING = gql`
    mutation VerifyBooking($bookingId: String!, $contact: String!) {
      verifyBooking(bookingId: $bookingId, contact: $contact)
    }
  `;

  const [verifyBooking, { loading }] = useMutation(VERIFY_BOOKING);

  const router = useRouter();

  return (
    <>
      <h2 className="text-black">Booking info</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await verifyBooking({
            variables: {
              bookingId: bookingInfo.id,
              contact: bookingInfo.contact,
            },
          });
          if (data.verifyBooking) {
            router.push("/booking-status");
          } else {
            toast.error("No booking found.");
          }
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="bookingCode"
            className="ml-1 text-xs text-gray-600"
          >
            Reservation Code
          </label>
          <input
            value={bookingInfo.id}
            onChange={(e) =>
              setBookingInfo((prev) => ({ ...prev, id: e.target.value }))
            }
            data-test="booking-status-code"
            required
            name="bookingCode"
            type="text"
            placeholder="Code we gave you after booking"
            className="transparent-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="ml-1 text-xs text-gray-600"
          >
            Contact Email
          </label>
          <input
            value={bookingInfo.contact}
            onChange={(e) =>
              setBookingInfo((prev) => ({ ...prev, contact: e.target.value }))
            }
            data-test="booking-status-email"
            required
            name="email"
            type="email"
            placeholder="Contact email you've provided"
            className="transparent-input"
          />
        </div>
        <button
          disabled={loading}
          data-test="booking-status-button"
          className="py-2 bg-blue-500 font-medium rounded-md text-white disabled:opacity-70 shadow-md shadow-black/10"
        >
          {loading ? "Loading..." : "Check Reservation"}
        </button>
      </form>
    </>
  );
};

const BookingStatusComponent = ({
  children,
  wrapperType = "popover",
}: {
  children: React.ReactNode;
  wrapperType?: "popover" | "dialog";
}) => {
  return wrapperType === "popover" ? (
    <Popover>
      <PopoverTrigger
        data-test="booking-status-popover-trigger"
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-md:hidden w-[400px] flex flex-col p-3 pt-4 gap-4 rounded-lg bg-white/70 backdrop-blur-lg border-white/30"
      >
        <FormContent />
      </PopoverContent>
    </Popover>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-[400px] flex flex-col p-3 pt-4 gap-4 rounded-lg bg-white/70 backdrop-blur-lg border-white/30">
        <DialogTitle hidden />
        {/* <DialogClose className="absolute top-4 right-4">
          <X
            size={16}
            color="white"
          />
        </DialogClose> */}
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default BookingStatusComponent;
