import { extractTime } from "@/lib/utils";
import React from "react";

const FlightDestination = ({
  side,
  destination,
  time,
}: {
  side: "left" | "right";
  destination: {
    city: string;
    airport: {
      name: string;
      id: string;
    };
  };
  time: Date;
}) => {
  return (
    <div
      className={`flex flex-col ${
        side === "left" ? "items-start" : "items-end"
      }`}
    >
      <span className="text-gray-500 max-sm:text-xs">{extractTime(new Date(time))}</span>
      <span className="font-medium max-sm:text-lg text-2xl">
        <span className="max-sm:hidden">{destination.city}</span>
        <span className="font-light"> ({destination.airport.id})</span>
      </span>
      <span
        className={`max-sm:hidden text-sm text-gray-800 ${
          side === "right" && "text-right"
        }`}
      >
        {destination.airport.name}
      </span>
    </div>
  );
};

export default FlightDestination;
