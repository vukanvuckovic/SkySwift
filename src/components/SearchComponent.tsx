import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTripType as setTripTypeBooking } from "@/lib/features/bookingSlice";
import {
  saveRecentSearch,
  setBookingState,
  setSearchState,
} from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { ArrangeHorizontal, Refresh } from "iconsax-react";
import AirportPicker from "./AirportPicker";
import PassengerPicker from "./PassengerPicker";
import { useRouter } from "next/navigation";
import {
  resetSearch,
  SearchState,
  setFrom,
  setReturning,
  setTo,
} from "@/lib/features/searchSlice";
import DatePicker from "./DatePicker";
import RecentSearch from "./RecentSearch";
import { Skeleton } from "./ui/skeleton";

const SearchComponent = ({
  edit = false,
  setSearchVisible,
}: {
  edit?: boolean;
  setSearchVisible?: Function;
}) => {
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<
    SearchState[] | undefined
  >();

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(res);
    setLoading(false);
  }, []);

  const bookingState = useSelector((state: RootState) => state.booking);
  const searchState = useSelector((state: RootState) => state.search);

  const { from, to, departureDate, returningDate, returning } = searchState;

  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center rounded-t-lg overflow-hidden w-fit text-white font-light">
        <button
          onClick={() => {
            dispatch(setTripTypeBooking("oneway"));
            dispatch(setReturning(false));
          }}
          className={`h-8 md:h-10 px-6 md:px-10 max-md:text-sm ${
            !returning
              ? edit
                ? "bg-blue-900 font-medium"
                : "bg-white/30 font-medium"
              : edit
              ? "bg-blue-900/50"
              : "bg-white/20"
          }
           backdrop-blur-2xl duration-200`}
        >
          One Way
        </button>
        <button
          onClick={() => {
            dispatch(setTripTypeBooking("returning"));
            dispatch(setReturning(true));
          }}
          className={`h-8 md:h-10 px-6 md:px-10 max-md:text-sm ${
            returning
              ? edit
                ? "bg-blue-900 font-medium"
                : "bg-white/30 font-medium"
              : edit
              ? "bg-blue-900/50"
              : "bg-white/20"
          } backdrop-blur-2xl duration-200`}
        >
          Return
        </button>
      </div>
      <div className="flex flex-col gap-1 bg-white rounded-xl rounded-tl-none shadow-md shadow-black/10">
        <div className="flex flex-col max-md:p-2 p-4 max-md:gap-2 gap-4">
          {!loading ? (
            recentSearches &&
            recentSearches.length > 0 && (
              <div className="flex flex-col max-md:gap-1 gap-3">
                <h3 className="ml-1">Recent searches</h3>
                <div className="flex flex-row w-full overflow-x-scroll py-1 scrollbar-hide items-center gap-2">
                  {recentSearches?.map((item, index) => (
                    <RecentSearch
                      key={index}
                      index={index}
                      searchData={item}
                      setRecentSearches={setRecentSearches}
                    />
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-20" />
              <div className="flex items-center gap-3 overflow-x-scroll scrollbar-hide">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="shrink-0 h-[60px] w-[220px] rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <h3 className="ml-1">Search for flights</h3>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 flex-shrink-0 flex flex-col md:flex-row md:items-center">
                <AirportPicker direction="from" />
                <button
                  onClick={() => {
                    dispatch(setFrom(to));
                    dispatch(setTo(from));
                  }}
                  className="p-2 aspect-square w-fit self-center rounded-full border-[1px] border-gray-200 bg-white -mt-1 -mb-1 md:-ml-1 md:-mr-1 z-10"
                >
                  <ArrangeHorizontal
                    size={16}
                    color="gray"
                  />
                </button>
                <AirportPicker direction="to" />
              </div>
              <div className="flex-1 flex-shrink-0 flex flex-col md:flex-row md:items-center gap-3">
                <DatePicker />
                {returning && <DatePicker type="return" />}
                <PassengerPicker />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between pl-6">
          {edit && setSearchVisible && (
            <button
              onClick={() => setSearchVisible(false)}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
          )}
          <div className="flex-1 flex max-md:flex-col max-md:items-end flex-row justify-end items-center max-md:gap-2 gap-6">
            <button
              onClick={() => {
                dispatch(resetSearch());
              }}
              className="flex flex-row items-center gap-2 text-blue-400 max-md:mr-3"
            >
              <Refresh
                color="#60a5fa"
                size={12}
              />
              Reset
            </button>
            <button
              data-test="search-button"
              disabled={
                from.city == "" ||
                to.city == "" ||
                departureDate == "" ||
                (returning && returningDate == "")
              }
              onClick={() => {
                setSearchState(searchState);
                setBookingState(bookingState);
                saveRecentSearch(searchState);
                {
                  edit
                    ? router.refresh()
                    : router.push("/booking/availability");
                }
              }}
              className="py-3 max-md:px-12 px-20 rounded-tl-xl rounded-br-xl bg-blue-500 text-white font-medium max-md:text-sm text-lg disabled:opacity-70"
            >
              Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
