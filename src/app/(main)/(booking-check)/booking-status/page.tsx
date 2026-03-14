"use client";

import BookingCard from "@/components/BookingCard";
import BookingSkeletonCard from "@/components/skeletons/BookingSkeletonCard";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Plane } from "lucide-react";

const BOOKING_STATUS = gql`
  fragment DestinationDetails on FlightDestination {
    city
    airport {
      name
      id
    }
  }

  fragment FlightDetails on Flight {
    id
    from {
      ...DestinationDetails
    }
    to {
      ...DestinationDetails
    }
    departure
    arrival
    plane {
      id
      name
    }
    pricing {
      basic {
        price
      }
      ecojet {
        price
      }
      premium {
        price
      }
      flex {
        price
      }
    }
  }

  fragment AdditionalOptionFields on AdditionalOptionSchema {
    name
    price
    flight {
      from {
        ...DestinationDetails
      }
      to {
        ...DestinationDetails
      }
    }
    quantity
  }

  query {
    bookingStatus {
      id
      flights {
        going {
          flight {
            ...FlightDetails
          }
          flightClass
          price
        }
        returning {
          flight {
            ...FlightDetails
          }
          flightClass
          price
        }
      }
      passengers {
        firstName
        lastName
        seats {
          ...AdditionalOptionFields
        }
        meals {
          ...AdditionalOptionFields
        }
        luggage {
          ...AdditionalOptionFields
        }
      }
      contact
      price
      tripType
    }
  }
`;

const BookingStatus = () => {
  const { data, loading } = useQuery(BOOKING_STATUS, {
    fetchPolicy: "no-cache",
  });

  const router = useRouter();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (!loading && !data?.bookingStatus) {
      router.push("/");
    }
    ScrollTrigger.refresh();
  }, [loading, data]);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Booking</h2>
          {!loading && data?.bookingStatus && (
            <span className="text-xs font-mono font-semibold text-slate-500 px-2.5 py-1 rounded-lg bg-slate-100">
              #{data.bookingStatus.id}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400">Your booking details and add-ons summary.</p>
      </div>

      {loading ? (
        <BookingSkeletonCard />
      ) : data?.bookingStatus ? (
        <BookingCard booking={data.bookingStatus} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Plane size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No booking found</p>
          <p className="text-sm text-slate-400">We couldn&apos;t find any active booking for your account.</p>
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
