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
    airport: { name: string; id: string };
  };
  time: Date;
}) => {
  return (
    <div className={`flex flex-col gap-0.5 ${side === "right" ? "items-end text-right" : "items-start"}`}>
      <span className="text-xs text-slate-400 font-medium">{extractTime(new Date(time))}</span>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-lg md:text-2xl text-slate-800 tracking-tight">
          {destination.airport.id}
        </span>
      </div>
      <span className="text-xs text-slate-500 font-medium truncate max-w-[80px] md:max-w-[120px]">
        {destination.city}
      </span>
    </div>
  );
};

export default FlightDestination;
