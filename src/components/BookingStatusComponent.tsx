import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import { Search } from "lucide-react";

const FormContent = () => {
  const [bookingInfo, setBookingInfo] = useState({ id: "", contact: "" });

  const VERIFY_BOOKING = gql`
    mutation VerifyBooking($bookingId: String!, $contact: String!) {
      verifyBooking(bookingId: $bookingId, contact: $contact)
    }
  `;

  const [verifyBooking, { loading }] = useMutation(VERIFY_BOOKING);
  const router = useRouter();

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 outline-none transition-all duration-150 placeholder:text-slate-300";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-bold text-slate-800">Check Booking Status</h3>
        <p className="text-xs text-slate-400">Enter your reservation code to view your booking.</p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await verifyBooking({
            variables: { bookingId: bookingInfo.id, contact: bookingInfo.contact },
          });
          if (data.verifyBooking) {
            router.push("/booking-status");
          } else {
            toast.error("Booking not found.", { description: "Check your code and email." });
          }
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 ml-0.5" htmlFor="bookingCode">
            Reservation Code
          </label>
          <input
            value={bookingInfo.id}
            onChange={(e) => setBookingInfo((prev) => ({ ...prev, id: e.target.value }))}
            data-test="booking-status-code"
            required
            name="bookingCode"
            type="text"
            placeholder="e.g. 6742a1b3c..."
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 ml-0.5" htmlFor="email">
            Contact Email
          </label>
          <input
            value={bookingInfo.contact}
            onChange={(e) => setBookingInfo((prev) => ({ ...prev, contact: e.target.value }))}
            data-test="booking-status-email"
            required
            name="email"
            type="email"
            placeholder="email used when booking"
            className={inputClass}
          />
        </div>

        <button
          disabled={loading}
          data-test="booking-status-button"
          className="flex justify-center items-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 font-semibold rounded-lg text-white text-sm transition-colors disabled:opacity-70"
        >
          <Search size={14} />
          {loading ? "Searching…" : "Find Booking"}
        </button>
      </form>
    </div>
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
      <PopoverTrigger data-test="booking-status-popover-trigger" asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-md:hidden w-[360px] flex flex-col p-4 rounded-xl bg-white shadow-xl border border-slate-100"
      >
        <FormContent />
      </PopoverContent>
    </Popover>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-[400px] flex flex-col p-5 rounded-xl bg-white">
        <DialogTitle hidden />
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default BookingStatusComponent;
