import React from "react";
import { Plane } from "lucide-react";
import { getTimeDifference } from "@/lib/utils";
import { Flight } from "@/lib/features/bookingSlice";

const FlightIllustration = ({ flightInfo }: { flightInfo: Flight[] }) => {
  const connected = flightInfo.length > 1;

  return (
    <div className="flex-1 flex items-center gap-1">
      {connected ? (
        <>
          <div className="flex-1 h-px bg-slate-200" />
          {/* Stopover indicator */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-medium">1 stop</span>
            <div className="w-7 h-7 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center">
              <Plane size={12} className="text-sky-500" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold text-slate-600 truncate max-w-[64px]">
                {flightInfo[0].to.city}
              </span>
              <span className="text-[9px] text-slate-400">
                {getTimeDifference(
                  new Date(flightInfo[0].arrival),
                  new Date(flightInfo[1].departure)
                )}
              </span>
            </div>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
        </>
      ) : (
        <>
          <div className="flex-1 h-px bg-slate-200" />
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <span className="text-[10px] text-emerald-500 font-semibold">Direct</span>
            <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Plane size={11} className="text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-400">
              {getTimeDifference(
                new Date(flightInfo[0].departure),
                new Date(flightInfo[0].arrival)
              )}
            </span>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
        </>
      )}

      {/* Plane icon at end */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center">
        <Plane size={14} className="text-white" fill="white" />
      </div>
    </div>
  );
};

export default FlightIllustration;
