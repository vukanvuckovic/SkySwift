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
import { ArrowLeftRight, Edit2, PlaneTakeoff } from "lucide-react";
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
      if (prevBooking) dispatch(updateBooking(prevBooking));
      dispatch(setLoadingState(false));
    }
  }, []);

  const GET_FLIGHTS = gql`
    fragment DestinationDetails on FlightDestination {
      city
      airport { name id }
    }
    fragment FlightDetails on Flight {
      id
      from { ...DestinationDetails }
      to { ...DestinationDetails }
      departure
      arrival
      plane {
        id name ailes
        seats { name price benefits rowsTo rowsFrom }
      }
      pricing {
        basic { price }
        ecojet { price }
        premium { price }
        flex { price }
      }
      takenSeats
    }
    query SearchFlights($fromCity: String!, $toCity: String!, $returning: Boolean!) {
      searchFlights(from: $fromCity, to: $toCity, returning: $returning) {
        directFlights { ...FlightDetails }
        returningDirectFlights { ...FlightDetails }
        connectedFlights { ... on Flight { ...FlightDetails } }
        returningConnectedFlights { ... on Flight { ...FlightDetails } }
      }
    }
  `;

  const { data, loading } = useQuery(GET_FLIGHTS, {
    variables: { fromCity: from.city, toCity: to.city, returning },
  });

  const {
    directFlights = [],
    connectedFlights = [],
    returningDirectFlights = [],
    returningConnectedFlights = [],
  } = data?.searchFlights || {};

  const { flights } = useSelector((state: RootState) => state.booking);
  const loaderLoading = useSelector((state: RootState) => state.loader.loading);

  const sectionLabel = (text: string) => (
    <div className="flight-direction-mark">{text}</div>
  );

  return !loaderLoading ? (
    <div className="flex flex-col gap-6 py-6 md:py-8">

      {/* Search summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-6 py-4 md:py-5 bg-white rounded-xl border border-slate-100 shadow-card">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <span className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              {from.city}
            </span>
            <ArrowLeftRight size={18} className="text-sky-500 flex-shrink-0" />
            <span className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              {to.city}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="text-slate-500">{from.airport.id}</span>
            <span>·</span>
            <span className="uppercase tracking-wider">Departure</span>
            <span className="text-slate-700">{formatDate(new Date(departureDate))}</span>
            {returningDate && returningDate !== "" && returning && (
              <>
                <span>·</span>
                <span className="uppercase tracking-wider">Return</span>
                <span className="text-slate-700">{formatDate(new Date(returningDate))}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setSearchVisible((prev) => !prev)}
          className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-600 hover:text-sky-700 text-sm font-medium transition-all duration-150"
        >
          <Edit2 size={14} />
          Edit Search
        </button>
      </div>

      {searchVisible && (
        <SearchComponent edit setSearchVisible={setSearchVisible} />
      )}

      {/* Selected flights preview */}
      {(flights.going.length > 0 || flights.returning.length > 0) && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">
            Selected Flights
          </p>
          <div className="flex flex-col gap-3">
            {flights.going.length > 0 && (
              <PreviewCard direction="going" flightInfo={flights.going} />
            )}
            {flights.returning.length > 0 && (
              <PreviewCard direction="returning" flightInfo={flights.returning} />
            )}
          </div>
        </div>
      )}

      {/* Flight listings */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <FlightSkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Going flights */}
          {directFlights.length > 0 && (
            <div className="flex flex-col gap-4">
              {sectionLabel("Direct Flights")}
              <div data-test="direct-flights-container" className="flex flex-col gap-3">
                {directFlights.map((item: Flight, i: number) => (
                  <MixedCard key={i} direction="going" flightInfo={[item]} />
                ))}
              </div>
            </div>
          )}

          {connectedFlights.length > 0 && (
            <div className="flex flex-col gap-4">
              {sectionLabel("Connected Flights")}
              <div data-test="connected-flights-container" className="flex flex-col gap-3">
                {connectedFlights.map((item: Flight[], i: number) => (
                  <MixedCard key={i} direction="going" flightInfo={item} />
                ))}
              </div>
            </div>
          )}

          {directFlights.length === 0 && connectedFlights.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
              <PlaneTakeoff size={36} className="opacity-30" />
              <p className="text-base font-medium">No outbound flights found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          )}

          {/* Returning flights */}
          {returning && returningDirectFlights.length > 0 && (
            <div className="flex flex-col gap-4">
              {sectionLabel("Direct Return Flights")}
              <div className="flex flex-col gap-3">
                {returningDirectFlights.map((item: Flight, i: number) => (
                  <MixedCard key={i} direction="returning" flightInfo={[item]} />
                ))}
              </div>
            </div>
          )}

          {returning && returningConnectedFlights.length > 0 && (
            <div className="flex flex-col gap-4">
              {sectionLabel("Connected Return Flights")}
              <div className="flex flex-col gap-3">
                {returningConnectedFlights.map((item: Flight[], i: number) => (
                  <MixedCard key={i} direction="returning" flightInfo={item} />
                ))}
              </div>
            </div>
          )}

          {returning && returningDirectFlights.length === 0 && returningConnectedFlights.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 text-slate-400">
              <PlaneTakeoff size={32} className="opacity-30 scale-x-[-1]" />
              <p className="text-base font-medium">No return flights found</p>
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;
};

export default Availability;
