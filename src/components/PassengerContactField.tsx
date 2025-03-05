import { setContact } from "@/lib/features/bookingSlice";
import { RootState } from "@/lib/store";
import { Mail } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const PassengerContactField = () => {
  const { contact } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-4 p-4 md:p-5 h-fit rounded-xl bg-white border border-slate-100 shadow-card">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-semibold text-slate-800">Contact Information</h3>
        <p className="text-xs text-slate-400">
          We will notify you here about any changes to your flights.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-0.5" htmlFor="contact-email">
          Contact Email
        </label>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            value={contact}
            onChange={(e) => dispatch(setContact(e.target.value))}
            data-test="passenger-info-contact"
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 transition-all duration-150 placeholder:text-slate-300"
          />
        </div>
      </div>
    </div>
  );
};

export default PassengerContactField;
