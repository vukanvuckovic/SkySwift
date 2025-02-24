import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Airplane, Clock, Ticket } from "iconsax-react";
import FlightDestination from "./FlightDestination";
import { Info, X } from "lucide-react";
import { formatDate, getTimeDifference } from "@/lib/utils";
import { Flight } from "@/lib/features/bookingSlice";

const DetailsDialog = ({ flightInfo }: { flightInfo: Flight[] }) => {
  const connected = flightInfo.length > 1;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex max-md:text-xs flex-row items-center gap-1 text-blue-500 cursor-pointer">
          <Info
            size={14}
            color="#3b82f6"
          />
          Details
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6 p-6 pb-10 rounded-xl w-full max-w-[800px]">
        <DialogClose className="absolute top-4 right-4 outline-none">
          <X
            size={16}
            color="gray"
          />
        </DialogClose>
        <DialogTitle className="hidden">Flight Details</DialogTitle>
        <h2 className="leading-none">Flight details</h2>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="max-md:text-sm font-medium">
              {formatDate(new Date(flightInfo[0].departure))}
            </span>
            <div className="w-fit flex max-md:flex-col max-md:w-full flex-row items-center max-md:px-3 px-6 max-md:py-2 py-3 max-md:gap-3 gap-4 bg-blue-100 rounded-md text-sm font-medium">
              <div className="flex flex-row items-center gap-2">
                <Ticket
                  size={18}
                  color="#3b82f6"
                />
                <span>SkySwift</span>
              </div>
              <div className="max-md:w-full max-md:h-[1px] w-[1px] h-6 bg-gray-300" />
              <div className="flex flex-row items-center gap-2">
                <Airplane
                  size={18}
                  color="#3b82f6"
                />
                <span>VF146</span>
              </div>
              <div className="max-md:w-full max-md:h-[1px] w-[1px] h-6 bg-gray-300" />
              <div className="flex flex-row items-center gap-2">
                <Clock
                  size={18}
                  color="#3b82f6"
                />
                <span>
                  {getTimeDifference(
                    new Date(flightInfo[0].departure),
                    new Date(flightInfo[flightInfo.length - 1].arrival)
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <FlightDestination
              destination={flightInfo[0].from}
              time={flightInfo[0].departure}
              side="left"
            />
            <div className="flex-1 flex flex-row items-center">
              <div className="flex-1 h-[1px] border-t-[1px] border-dashed border-green-400" />
              <div className="max-md:w-10 w-14 aspect-square rounded-full flex flex-col justify-center items-center border-[1px] border-green-400 relative">
                {connected && (
                  <span className="text-gray-500 truncate text-center self-center absolute -top-2 -translate-y-full">
                    {flightInfo[0].to.city}
                  </span>
                )}
                <Airplane
                  size={32}
                  color="#3b82f6"
                  variant="Bold"
                  className="rotate-90 max-md:hidden"
                />
                <Airplane
                  size={24}
                  color="#3b82f6"
                  variant="Bold"
                  className="rotate-90 md:hidden"
                />
                <span className="max-md:text-xs text-gray-500 truncate text-center self-center absolute -bottom-2 translate-y-full">
                  {flightInfo[0].plane.name +
                    (connected ? ` + ${flightInfo[1].plane.name}` : "")}
                </span>
              </div>
              <div className="flex-1 h-[1px] border-t-[1px] border-dashed border-green-400" />
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
