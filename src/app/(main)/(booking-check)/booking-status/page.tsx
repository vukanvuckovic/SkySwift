"use client";

import BookingCard from "@/components/BookingCard";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingSkeletonCard from "@/components/skeletons/BookingSkeletonCard";
import { Empty } from "antd";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import gsap from "gsap";

const BookingStatus = () => {
  // const [loading, setLoading] = useState(true);
  // const [booking, setBooking] = useState<BookingState>();

  // useEffect(() => {
  //   const fetchBooking = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3000/api/bookings/verify-booking`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         console.error("Error fetching booking:", response.statusText);
  //         return;
  //       }

  //       const data = await response.json();
  //       setBooking(data.booking);
  //     } catch (error) {
  //       console.error("Error fetching booking:", error);
  //     } finally {
  //       setLoading(false);
  //       ScrollTrigger.refresh(true);
  //     }
  //   };

  //   fetchBooking();
  // }, []);

  // if (loading || !booking) {
  //   return <span className="text-black">Loading...</span>;
  // }

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

  const { data, loading, error } = useQuery(BOOKING_STATUS, {
    fetchPolicy: "no-cache",
  });

  console.log(data, loading, error);

  const router = useRouter();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (!loading && !data?.bookingStatus) {
      router.push("/");
    }

    ScrollTrigger.refresh();
  }, [loading, data]);

  return (
    true && (
      <div className="flex flex-col gap-8 py-8">
        <div className="flex max-md:flex-col max-md:gap-2 items-start md:items-center gap-4">
          <h1 className="max-md:text-lg">Booking</h1>
          {!loading && data?.bookingStatus && (
            <span className="max-md:text-xs text-lg text-gray-500 max-md:px-2 px-3 max-md:py-1.5 py-2 rounded-lg bg-gray-200">
              {data.bookingStatus.id}
            </span>
          )}
        </div>
        {loading ? (
          <BookingSkeletonCard />
        ) : data?.bookingStatus ? (
          <BookingCard booking={data?.bookingStatus} />
        ) : (
          <Empty />
        )}
      </div>
    )
  );
};

export default BookingStatus;
