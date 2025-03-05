"use client";
import BookingCard from "@/components/BookingCard";
import BookingSkeletonCard from "@/components/skeletons/BookingSkeletonCard";
import React, { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { BookingState } from "@/lib/features/bookingSlice";
import { PlaneTakeoff } from "lucide-react";
import Link from "next/link";

const MyBookings = () => {
  const GET_MY_BOOKINGS = gql`
    fragment FlightDetails on Flight {
      id
      from { city airport { name id } }
      to { city airport { name id } }
      departure
      arrival
      plane { id name }
      pricing {
        basic { price }
        ecojet { price }
        premium { price }
        flex { price }
      }
    }

    fragment AdditionalOptionFields on AdditionalOptionSchema {
      name
      price
      flight { ...FlightDetails }
      quantity
    }

    query {
      getMyBookings {
        id
        flights {
          going { flight { ...FlightDetails } flightClass price }
          returning { flight { ...FlightDetails } flightClass price }
        }
        passengers {
          firstName lastName
          seats { ...AdditionalOptionFields }
          meals { ...AdditionalOptionFields }
          luggage { ...AdditionalOptionFields }
        }
        contact
        price
        tripType
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_MY_BOOKINGS);

  useEffect(() => {
    ScrollTrigger.refresh(true);
  }, [data, loading, error]);

  return (
    <div className="flex flex-col gap-6 py-6 md:py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">My Bookings</h1>
        <p className="text-sm text-slate-400">View and manage all your flight bookings.</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <BookingSkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <PlaneTakeoff size={36} className="opacity-30" />
          <p className="font-medium">Failed to load bookings</p>
          <p className="text-sm">Please refresh the page and try again.</p>
        </div>
      ) : data && data.getMyBookings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {data.getMyBookings.map((item: BookingState, index: number) => (
            <BookingCard key={index} booking={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <PlaneTakeoff size={28} className="opacity-40" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="font-semibold text-slate-600">No bookings yet</p>
            <p className="text-sm">Your completed bookings will appear here.</p>
          </div>
          <Link
            href="/"
            className="mt-2 px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors"
          >
            Book a Flight
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
