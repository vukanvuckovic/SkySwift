import { Check } from "lucide-react";
import React from "react";
import AuthComponent from "./AuthComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const BENEFITS = [
  "Quick access to all your past bookings",
  "Autofill passenger details on future bookings",
  "Easy online check-in management",
];

const PassengerInfoSignIn = () => {
  const { user } = useSelector((state: RootState) => state.user);

  if (user) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm">
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Check size={12} className="text-white" />
        </div>
        <span>
          Signed in as <span className="font-semibold">{user.firstName} {user.lastName}</span>. Your booking will be saved to your account.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-5 bg-gradient-to-br from-sky-600 to-navy-800 rounded-xl text-white">
      {/* Benefits */}
      <div className="flex-1 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-lg text-white">Sign in for a better experience</h3>
          <p className="text-sky-200 text-sm font-light">Members enjoy exclusive benefits</p>
        </div>
        <ul className="flex flex-col gap-2">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm text-sky-100">
              <div className="w-4 h-4 rounded-full bg-sky-400/30 border border-sky-400/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                <Check size={10} className="text-sky-200" />
              </div>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Sign in button */}
      <div className="flex md:items-center md:justify-center md:border-l md:border-white/20 md:pl-6">
        <AuthComponent wrapperType="dialog">
          <button className="px-6 py-2.5 rounded-lg bg-white text-sky-700 font-semibold text-sm hover:bg-sky-50 transition-colors">
            Sign In
          </button>
        </AuthComponent>
      </div>
    </div>
  );
};

export default PassengerInfoSignIn;
