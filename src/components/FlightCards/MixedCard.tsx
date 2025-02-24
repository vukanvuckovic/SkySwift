import React, { useState } from "react";
import { ArrowDown2 } from "iconsax-react";
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

  // const connected = !!flightInfo.connectingCity;
  const connected = flightInfo.length > 1;

  const { passengers } = useSelector((state: RootState) => state.booking);

  return (
    <div
      onClick={() => setClassesVisible((prev) => !prev)}
      data-test="flight-item"
      className="flex flex-col w-full gap-10 px-4 md:px-8 py-3 md:py-6 bg-white rounded-lg shadow-md shadow-gray-200 relative group cursor-pointer"
    >
      <div className="main-info flex flex-col md:flex-row gap-6 md:gap-12 md:items-center">
        <div className="flex-1 flex flex-row items-center gap-4 max-sm:py-3">
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
        <div className="flex flex-row items-center gap-10 max-md:justify-between">
          <DetailsDialog flightInfo={flightInfo} />
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="max-md:text-sm font-medium">
                {(
                  flightInfo[0].pricing.basic.price +
                  (connected ? flightInfo[1]?.pricing.basic.price : 0)
                ).toFixed(2)}{" "}
                EUR
              </span>
              {passengers.length > 1 && (
                <span className="text-[10px] text-gray-500">
                  *{passengers.length} passengers
                </span>
              )}
            </div>

            <div className="p-2 aspect-square rounded-full bg-gray-100">
              <ArrowDown2
                size={16}
                color="gray"
              />
            </div>
          </div>
        </div>
      </div>
      {classesVisible && (
        <FlightClasses
          direction={direction}
          flightInfo={flightInfo}
        />
      )}
    </div>
  );
};

export default MixedCard;
