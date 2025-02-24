"use client";
import React, { useEffect, useState } from "react";
import MixedCard from "@/components/FlightCards/MixedCard";
import PreviewCard from "@/components/FlightCards/PreviewCard";
import SearchComponent from "@/components/SearchComponent";
import FlightSkeletonCard from "@/components/skeletons/FlightSkeletonCard";
import { Flight, updateBooking } from "@/lib/features/bookingSlice";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { updateSearch } from "@/lib/features/searchSlice";
import { getBookingState, getSearchState } from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { ArrangeHorizontal } from "iconsax-react";
import { Edit2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const Availability = () => {
  const [searchVisible, setSearchVisible] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const searchInfo = useSelector((state: RootState) => state.search);
  const { from, to, returning, departureDate, returningDate } = searchInfo;

  const loaderSlice = useSelector((state: RootState) => state.loader);
  const loadingState = loaderSlice.loading;

  useEffect(() => {
    if (!loadingState && !searchInfo) {
      router.push("/");
    }
  }, [searchInfo, loadingState]);

  useEffect(() => {
    const prevSearch = getSearchState();
    const prevBooking = getBookingState();
    if (!prevSearch) {
      router.push("/");
    } else {
      dispatch(updateSearch(prevSearch));
      dispatch(updateBooking(prevBooking));
      dispatch(setLoadingState(false));
    }
  }, []);

  const GET_FLIGHTS = gql`
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
        ailes
        seats {
          name
          price
          benefits
          rowsTo
          rowsFrom
        }
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
      takenSeats
    }

    query SearchFlights(
      $fromCity: String!
      $toCity: String!
      $returning: Boolean!
    ) {
      searchFlights(from: $fromCity, to: $toCity, returning: $returning) {
        directFlights {
          ...FlightDetails
        }
        returningDirectFlights {
          ...FlightDetails
        }
        connectedFlights {
          ... on Flight {
            ...FlightDetails
          }
        }
        returningConnectedFlights {
          ... on Flight {
            ...FlightDetails
          }
        }
      }
    }
  `;

  const { data, loading } = useQuery(GET_FLIGHTS, {
    variables: { fromCity: from.city, toCity: to.city, returning: returning },
  });

  const {
    directFlights = [],
    connectedFlights = [],
    returningDirectFlights = [],
    returningConnectedFlights = [],
  } = data?.searchFlights || {};

  const { flights } = useSelector((state: RootState) => state.booking);
  const loaderLoading = useSelector((state: RootState) => state.loader.loading);

  return (
    !loaderLoading && (
      <div className="flex flex-col max-md:gap-6 gap-8 py-8">
        <h2 className="ml-2">Availability</h2>
        <div className="flex flex-col max-md:gap-6 gap-8 md:flex-row md:items-center justify-between max-md:px-4 px-8 max-md:py-4 py-6 bg-white rounded-lg border-[1px] border-b-[3px] border-blue-300">
          <div className="flex flex-col max-md:gap-2 gap-4">
            <div className="flex flex-row max-md:justify-between max-md:w-full items-center gap-4">
              <span className="font-medium max-md:text-lg text-2xl">
                {from.city}
                <span className="font-light"> ({from.airport.id})</span>
              </span>
              <ArrangeHorizontal
                size={20}
                color="blue"
              />
              <span className="font-medium max-md:text-lg text-2xl">
                {to.city}
                <span className="font-light"> ({to.airport.id})</span>
              </span>
            </div>
            <div className="flex flex-row items-center gap-2 font-medium max-md:text-xs">
              <span className="font-bold">DEPARTURE</span>
              <span>{formatDate(new Date(departureDate))}</span>
              {returningDate && returningDate !== "" && returning && (
                <>
                  <div className="h-8 w-[1px] bg-gray-200 mx-2" />
                  <span className="font-bold">RETURN</span>
                  <span>{formatDate(new Date(returningDate))}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => setSearchVisible((prev) => !prev)}
            className="flex flex-row items-center gap-3 py-1 max-md:px-3 px-5 max-md:text-sm border-[1px] border-blue-400 rounded-lg max-md:self-end"
          >
            <Edit2Icon
              size={16}
              color="black"
            />
            <span>Edit Search</span>
          </button>
        </div>

        {searchVisible && (
          <SearchComponent
            edit
            setSearchVisible={setSearchVisible}
          />
        )}

        {loading ? (
          Array.from({ length: 20 }).map((_, index) => (
            <FlightSkeletonCard key={index} />
          ))
        ) : (
          <>
            {(flights.going.length > 0 || flights.returning.length > 0) && (
              <div
                id="my-flights"
                className="flex flex-col gap-4"
              >
                <h3 className="ml-2">My Flights</h3>
                <div className="flex flex-col gap-4">
                  {flights.going.length > 0 && (
                    <PreviewCard
                      direction="going"
                      flightInfo={flights.going}
                    />
                  )}
                  {flights.returning.length > 0 && (
                    <PreviewCard
                      direction="returning"
                      flightInfo={flights.returning}
                    />
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-10">
              {directFlights && directFlights.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flight-direction-mark">Direct Flights</div>
                  <div
                    data-test="direct-flights-container"
                    className="flex flex-col gap-4"
                  >
                    {directFlights?.map((item: Flight, index: number) => (
                      <MixedCard
                        direction="going"
                        key={index}
                        flightInfo={[item]}
                      />
                    ))}
                  </div>
                </div>
              )}
              {connectedFlights && connectedFlights.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flight-direction-mark">Connected Flights</div>
                  <div
                    data-test="connected-flights-container"
                    className="flex flex-col gap-4"
                  >
                    {connectedFlights?.map((item: Flight[], index: number) => (
                      <MixedCard
                        direction="going"
                        key={index}
                        flightInfo={item}
                      />
                    ))}
                  </div>
                </div>
              )}
              {connectedFlights?.length === 0 &&
                directFlights?.length === 0 && (
                  <span className="text-lg text-gray-600 self-center">
                    No going flights found.
                  </span>
                )}
              {returning &&
                returningDirectFlights &&
                returningDirectFlights?.length > 0 && (
                  <div className="flex flex-col gap-6">
                    <div className="flight-direction-mark">
                      Direct Returning Flights
                    </div>
                    <div className="flex flex-col gap-4">
                      {returningDirectFlights?.map(
                        (item: Flight, index: number) => (
                          <MixedCard
                            direction="returning"
                            key={index}
                            flightInfo={[item]}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              {returning &&
                returningConnectedFlights &&
                returningConnectedFlights?.length > 0 && (
                  <div className="flex flex-col gap-6">
                    <div className="flight-direction-mark">
                      Connected Returning Flights
                    </div>
                    <div className="flex flex-col gap-4">
                      {returningConnectedFlights?.map(
                        (item: Flight[], index: number) => (
                          <MixedCard
                            direction="returning"
                            key={index}
                            flightInfo={item}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              {returningConnectedFlights?.length === 0 &&
                returningDirectFlights?.length === 0 &&
                returning && (
                  <span className="text-lg text-gray-600 self-center">
                    No returning flights found.
                  </span>
                )}
            </div>
          </>
        )}
      </div>
    )
  );
};

export default Availability;
