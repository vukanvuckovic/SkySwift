import React from "react";
import { Skeleton } from "../ui/skeleton";
import FlightSkeletonCard from "./FlightSkeletonCard";

const BookingSkeletonCard = () => {
  return (
    <div className="flex flex-col gap-12 rounded-xl p-6 bg-white shadow-md shadow-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[30px] w-[200px]" />
          <Skeleton className="h-[14px] w-[120px]" />
        </div>
        <Skeleton className="h-[30px] w-[100px]" />
      </div>
      <div className="flex flex-col gap-4">
        <FlightSkeletonCard />
        <FlightSkeletonCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[30px] w-[300px]" />
          <div className="flex flex-col gap-1 ml-2">
            <Skeleton className="h-[16px] w-[200px]" />
            <Skeleton className="h-[16px] w-[200px]" />
            <Skeleton className="h-[16px] w-[200px]" />
            <Skeleton className="h-[16px] w-[200px]" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[30px] w-[300px]" />
          <div className="flex flex-col gap-1 ml-2">
            <Skeleton className="h-[16px] w-[200px]" />
            <Skeleton className="h-[16px] w-[200px]" />
            <Skeleton className="h-[16px] w-[200px]" />
            <Skeleton className="h-[16px] w-[200px]" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-[30px] w-[200px]" />
        <Skeleton className="h-[30px] w-[150px]" />
      </div>
    </div>
  );
};

export default BookingSkeletonCard;
