import { X } from "lucide-react";
import React from "react";
import FlightDestination from "./FlightDestination";
import FlightIllustration from "./FlightIllustration";
import DetailsDialog from "./DetailsDialog";
import { useDispatch, useSelector } from "react-redux";
import { BookingFlight, removeFlights } from "@/lib/features/bookingSlice";
import { formatDate } from "@/lib/utils";
import { RootState } from "@/lib/store";
import { toast } from "sonner";

const CLASS_COLORS: Record<string, string> = {
  basic: "bg-slate-600",
  ecojet: "bg-sky-600",
  flex: "bg-emerald-600",
  premium: "bg-violet-600",
};

const PreviewCard = ({
  flightInfo,
  direction,
  nonremoveable = false,
}: {
  flightInfo: BookingFlight[];
  direction: "going" | "returning";
  nonremoveable?: boolean;
}) => {
  const connected = flightInfo.length > 1;
  const { passengers } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();

  const flightClass = flightInfo[0].flightClass.toLowerCase();
  const badgeColor = CLASS_COLORS[flightClass] ?? "bg-slate-500";

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 md:px-5 py-2.5 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {direction === "going" ? "Outbound" : "Return"}
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">
            {formatDate(new Date(flightInfo[0].flight.departure))}
          </span>
          {!nonremoveable && (
            <button
              onClick={() => {
                dispatch(
                  removeFlights([
                    flightInfo[0].flight.id,
                    flightInfo[flightInfo.length - 1]?.flight.id,
                  ])
                );
                toast.success("Flight removed.");
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors ml-1"
            >
              <X size={12} />
              Remove
            </button>
          )}
        </div>

        <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${badgeColor}`}>
          {flightClass.charAt(0).toUpperCase() + flightClass.slice(1)}
        </span>
      </div>

      {/* Flight info */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-4 md:px-6 py-4 md:py-5">
        <div className="flex-1 flex items-center gap-4">
          <FlightDestination
            destination={flightInfo[0].flight.from}
            time={flightInfo[0].flight.departure}
            side="left"
          />
          <FlightIllustration flightInfo={flightInfo.map((item) => item.flight)} />
          <FlightDestination
            destination={flightInfo[flightInfo.length - 1].flight.to}
            time={flightInfo[flightInfo.length - 1].flight.arrival}
            side="right"
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6">
          <DetailsDialog flightInfo={flightInfo.map((item) => item.flight)} />
          <div className="flex flex-col items-end">
            <span className="font-bold text-slate-800">
              {(
                flightInfo[0].flight.pricing?.[flightClass as FlightClassName].price +
                (connected
                  ? (flightInfo[1]?.flight.pricing?.[flightClass as FlightClassName]?.price ?? 0)
                  : 0)
              ).toFixed(2)}{" "}
              <span className="font-normal text-slate-400 text-sm">EUR</span>
            </span>
            {passengers.length > 1 && (
              <span className="text-xs text-slate-400">
                × {passengers.length} passengers
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
