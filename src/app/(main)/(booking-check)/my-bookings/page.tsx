"use client";
import BookingCard from "@/components/BookingCard";
import BookingSkeletonCard from "@/components/skeletons/BookingSkeletonCard";
import React, { useEffect } from "react";
import { Empty } from "antd";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { BookingState } from "@/lib/features/bookingSlice";

const MyBookings = () => {
  const GET_MY_BOOKINGS = gql`
    fragment FlightDetails on Flight {
      id
      from {
        city
        airport {
          name
          id
        }
      }
      to {
        city
        airport {
          name
          id
        }
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
        ...FlightDetails
      }
      quantity
    }

    query {
      getMyBookings {
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
        # id
        contact
        price
        tripType
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_MY_BOOKINGS);

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:3000/api/bookings/my-bookings",
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) console.log("no response");

  //       const data = await response.json();

  //       setBookings(data.bookings);
  //     } catch (error) {
  //       console.error("Error fetching bookings:", error);
  //     } finally {
  //       setLoading(false);
  //       ScrollTrigger.refresh(true);
  //     }
  //   };
  //   fetchBookings();
  // }, []);

  useEffect(() => {
    ScrollTrigger.refresh(true);
  }, [data, loading, error]);

  return (
    <div className="flex flex-col gap-8 py-8">
      <h1>My Bookings</h1>
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <BookingSkeletonCard key={index} />
        ))
      ) : data && data.getMyBookings.length > 0 ? (
        data.getMyBookings.map((item: BookingState, index: number) => (
          <BookingCard
            key={index}
            booking={item}
          />
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default MyBookings;
