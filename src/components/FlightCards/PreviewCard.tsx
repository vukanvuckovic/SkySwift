import { PlaneIcon } from "lucide-react";
import React from "react";
import FlightDestination from "./FlightDestination";
import FlightIllustration from "./FlightIllustration";
import DetailsDialog from "./DetailsDialog";
import { useDispatch, useSelector } from "react-redux";
import { BookingFlight, removeFlights } from "@/lib/features/bookingSlice";
import { formatDate } from "@/lib/utils";
import { RootState } from "@/lib/store";
import { toast } from "sonner";

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

  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md shadow-gray-200">
      <div className="md:h-12 flex flex-row items-center justify-between border-b-[1px] border-dashed border-gray-300 bg-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 ml-4 max-md: py-3">
          <span className="font-medium max-md:text-sm">
            {direction === "going" ? "DEPARTURE" : "RETURNING"}
          </span>
          <div className="max-md:hidden h-6 w-[1px] rounded-full bg-gray-300" />
          <span className="md:hidden max-md:text-xs text-sm font-medium">
            {formatDate(new Date(flightInfo[0].flight.departure))}
          </span>
          {!nonremoveable && (
            <button
              onClick={() => {
                console.log("removed flihgts", flightInfo)
                dispatch(
                  removeFlights([
                    flightInfo[0].flight.id,
                    flightInfo[flightInfo.length - 1]?.flight.id,
                  ])
                );
                toast.success("Flight Removed.");
              }}
              className="flex flex-row items-center gap-1 text-blue-500 font-medium max-md:text-xs text-sm"
            >
              <PlaneIcon
                size={14}
                color="#3b82f6"
              />
              Change flight
            </button>
          )}
        </div>
        <span className="max-md:hidden font-medium">
          {formatDate(new Date(flightInfo[0].flight.departure))}
        </span>
        <div className="h-full flex justify-center items-center px-8 md:px-16 rounded-tl-full max-md:text-sm font-bold md:font-medium max-md:text-blue-500 md:text-white md:bg-gray-400">
          {flightInfo[0].flightClass.toUpperCase()}
        </div>
      </div>
      <div className="main-info flex flex-col md:flex-row md:items-center gap-4 md:gap-12 px-4 md:px-8 py-3 md:py-6">
        <div className="flex-1 flex flex-row items-center gap-4 max-md:py-2">
          <FlightDestination
            destination={flightInfo[0].flight.from}
            time={flightInfo[0].flight.departure}
            side="left"
          />
          <FlightIllustration
            flightInfo={flightInfo.map((item) => item.flight)}
          />
          <FlightDestination
            destination={flightInfo[flightInfo.length - 1].flight.to}
            time={flightInfo[flightInfo.length - 1].flight.arrival}
            side="right"
          />
        </div>
        <div className="flex flex-row items-center max-md:justify-between gap-12">
          <DetailsDialog
            flightInfo={
              // connected
              //   ? flightInfo.map((item)=>item.flight)
              //   : flightInfo[0].flight
              flightInfo.map((item) => item.flight)
            }
          />

          <div className="flex flex-col items-end">
            <span className="font-medium">
              {(
                flightInfo[0].flight.pricing?.[
                  flightInfo[0].flightClass.toLowerCase() as FlightClassName
                ].price +
                (connected
                  ? flightInfo[1]?.flight.pricing?.[
                      flightInfo[1].flightClass.toLowerCase() as FlightClassName
                    ]?.price
                  : 0)
              ).toFixed(2)}{" "}
              EUR
            </span>

            {passengers.length > 1 && (
              <span className="text-[10px] text-gray-500">
                *{passengers.length} passengers
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
