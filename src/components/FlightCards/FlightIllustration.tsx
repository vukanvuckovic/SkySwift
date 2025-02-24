import React from "react";
import { Airplane, ArrangeVertical } from "iconsax-react";
import { Ticket } from "lucide-react";
import { getTimeDifference } from "@/lib/utils";
import { Flight } from "@/lib/features/bookingSlice";

const FlightIllustration = ({ flightInfo }: { flightInfo: Flight[] }) => {
  // const connected = !!flightInfo.connectingCity;
  const connected = flightInfo.length > 1;

  return (
    <div className="flex-1 flex flex-row items-center">
      {connected ? (
        <>
          <div className="flex-1 h-[1px] bg-gray-200" />
          <div className="max-md:hidden flex-shrink-0 w-7 aspect-square flex items-center justify-center rounded-full border-[1px] border-gray-200">
            <Ticket
              size={14}
              color="#3b82f6"
            />
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
          <div className="flex-shrink-0 w-8 aspect-square rounded-full flex flex-col justify-center items-center border-[1px] border-gray-300 bg-white relative">
            <span className="max-sm:text-[9px] text-xs text-gray-500 truncate absolute -top-1 self-center -translate-y-[100%]">
              1 Transfer
            </span>
            <ArrangeVertical
              size={16}
              color="#3b82f6"
            />
            <div className="flex flex-col items-center absolute -bottom-1 self-center translate-y-[100%]">
              <span className="max-sm:text-[10px] text-[12px] text-gray-600 truncate">
                {flightInfo[0].to.city}
              </span>
              <span className="max-sm:text-[9px] text-[10px] text-gray-500 truncate">
                {getTimeDifference(
                  new Date(flightInfo[0].arrival),
                  new Date(flightInfo[1].departure)
                )}
              </span>
            </div>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
          <div className="max-md:hidden flex-shrink-0 w-7 aspect-square flex items-center justify-center rounded-full border-[1px] border-gray-200">
            <Ticket
              size={14}
              color="#3b82f6"
            />
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </>
      ) : (
        <>
          <div className="flex-1 h-[1px] bg-gray-200" />
          <div className="flex-shrink-0 w-7 h-7 rounded-full flex flex-col justify-center items-center border-[1px] border-gray-300 bg-white relative">
            <span className="max-sm:text-[10px] text-xs text-gray-500 truncate absolute -top-1 self-center -translate-y-[100%]">
              Direct
            </span>
            <ArrangeVertical
              size={14}
              color="#3b82f6"
            />
            <span className="max-sm:text-[9px] text-[10px] text-gray-500 truncate absolute -bottom-1 self-center translate-y-[100%]">
              {getTimeDifference(
                new Date(flightInfo[0].departure),
                new Date(flightInfo[0].arrival)
              )}
            </span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </>
      )}
      <Airplane
        size="24"
        color="#3b82f6"
        className="flex-shrink-0 rotate-90"
        variant="Bold"
      />
    </div>
  );
};

export default FlightIllustration;
