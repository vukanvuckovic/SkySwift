import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import FlightDestination from "./FlightDestination";
import FlightIllustration from "./FlightIllustration";
import FlightClasses from "./FlightClasses";
import DetailsDialog from "./DetailsDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Flight } from "@/lib/features/bookingSlice";

const MixedCard = ({
  flightInfo,
  direction,
}: {
  flightInfo: Flight[];
  direction: "going" | "returning";
}) => {
  const [classesVisible, setClassesVisible] = useState(false);
  const connected = flightInfo.length > 1;
  const { passengers } = useSelector((state: RootState) => state.booking);

  const totalPrice = (
    flightInfo[0].pricing.basic.price +
    (connected ? flightInfo[1]?.pricing.basic.price ?? 0 : 0)
  ).toFixed(2);

  return (
    <div
      data-test="flight-item"
      className="flex flex-col w-full bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden"
    >
      {/* Main info row */}
      <div
        onClick={() => setClassesVisible((prev) => !prev)}
        className="flex flex-col md:flex-row gap-4 md:gap-8 md:items-center px-4 md:px-6 py-4 md:py-5 cursor-pointer group"
      >
        {/* Route + illustration */}
        <div className="flex-1 flex items-center gap-4">
          <FlightDestination
            destination={flightInfo[0].from}
            time={flightInfo[0].departure}
            side="left"
          />
          <FlightIllustration flightInfo={flightInfo} />
          <FlightDestination
            destination={flightInfo[flightInfo.length - 1].to}
            time={flightInfo[flightInfo.length - 1].arrival}
            side="right"
          />
        </div>

        {/* Price + actions */}
        <div className="flex items-center justify-between md:justify-end gap-6">
          <DetailsDialog flightInfo={flightInfo} />

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-base md:text-lg font-bold text-slate-800">
                {totalPrice}{" "}
                <span className="text-sm font-normal text-slate-400">EUR</span>
              </span>
              {passengers.length > 1 && (
                <span className="text-[11px] text-slate-400">
                  × {passengers.length} passengers
                </span>
              )}
              <span className="text-[11px] text-sky-500 font-medium">from Basic</span>
            </div>

            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
              {classesVisible ? (
                <ChevronUp size={16} className="text-slate-500 group-hover:text-sky-600" />
              ) : (
                <ChevronDown size={16} className="text-slate-500 group-hover:text-sky-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable classes */}
      {classesVisible && (
        <div className="border-t border-slate-100 px-4 md:px-6 py-4 bg-slate-50/50">
          <FlightClasses direction={direction} flightInfo={flightInfo} />
        </div>
      )}
    </div>
  );
};

export default MixedCard;
