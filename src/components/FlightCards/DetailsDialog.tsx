import React from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FlightDestination from "./FlightDestination";
import { Info, X, Clock, Plane, Ticket } from "lucide-react";
import { formatDate, getTimeDifference } from "@/lib/utils";
import { Flight } from "@/lib/features/bookingSlice";

const DetailsDialog = ({ flightInfo }: { flightInfo: Flight[] }) => {
  const connected = flightInfo.length > 1;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs text-sky-600 font-medium hover:text-sky-700 transition-colors">
          <Info size={13} />
          Details
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6 p-6 rounded-2xl w-full max-w-[640px]">
        <DialogClose className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors outline-none">
          <X size={16} className="text-slate-400" />
        </DialogClose>
        <DialogTitle className="sr-only">Flight Details</DialogTitle>

        <h2 className="font-bold text-xl text-slate-800 tracking-tight">Flight Details</h2>

        <div className="flex flex-col gap-8">
          {/* Flight meta */}
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-500 font-medium">
              {formatDate(new Date(flightInfo[0].departure))}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-100 rounded-lg text-sky-700 font-medium">
                <Ticket size={14} />
                <span>SkySwift</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 font-medium">
                <Plane size={14} />
                <span>VF146</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 font-medium">
                <Clock size={14} />
                <span>
                  {getTimeDifference(
                    new Date(flightInfo[0].departure),
                    new Date(flightInfo[flightInfo.length - 1].arrival)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Route illustration */}
          <div className="flex items-center gap-4 px-2">
            <FlightDestination
              destination={flightInfo[0].from}
              time={flightInfo[0].departure}
              side="left"
            />

            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-px border-t border-dashed border-emerald-400" />
              <div className="flex flex-col items-center gap-1">
                {connected && (
                  <span className="text-xs text-slate-400 font-medium">
                    via {flightInfo[0].to.city}
                  </span>
                )}
                <div className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-white flex items-center justify-center">
                  <Plane size={18} className="text-sky-500 rotate-90" />
                </div>
                <span className="text-xs text-slate-400">
                  {flightInfo[0].plane.name}
                  {connected && ` + ${flightInfo[1].plane.name}`}
                </span>
              </div>
              <div className="flex-1 h-px border-t border-dashed border-emerald-400" />
            </div>

            <FlightDestination
              destination={flightInfo[flightInfo.length - 1].to}
              time={flightInfo[flightInfo.length - 1].arrival}
              side="right"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
