import React from "react";
import { Skeleton } from "../ui/skeleton";

export const FlightSkeletonCard = () => (
  <div className="flex flex-row items-center gap-6 shadow-md shadow-gray-200 rounded-xl p-6 bg-white">
    <div className="flex-1 flex flex-row items-center gap-4">
      <div className="flex flex-col items-start gap-1">
        <Skeleton className="h-[20px] w-[80px]" />
        <Skeleton className="h-[20px] w-[120px]" />
        <Skeleton className="h-[20px] w-[150px]" />
      </div>
      <Skeleton className="flex-1 h-[5px]" />
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-[20px] w-[80px]" />
        <Skeleton className="h-[20px] w-[120px]" />
        <Skeleton className="h-[20px] w-[150px]" />
      </div>
    </div>
    <div className="flex flex-row items-center gap-6">
      <Skeleton className="h-[30px] w-[60px]" />
      <Skeleton className="h-[30px] w-[100px]" />
    </div>
  </div>
);

export default FlightSkeletonCard;
