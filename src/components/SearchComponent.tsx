import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTripType as setTripTypeBooking } from "@/lib/features/bookingSlice";
import {
  saveRecentSearch,
  setBookingState,
  setSearchState,
} from "@/lib/localStorage";
import { RootState } from "@/lib/store";
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
import { ArrowLeftRight, PlaneTakeoff, RotateCcw, Search } from "lucide-react";

const SearchComponent = ({
  edit = false,
  setSearchVisible,
}: {
  edit?: boolean;
  setSearchVisible?: (visible: boolean) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<SearchState[]>([]);

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

  const tripButtonBase =
    "px-5 md:px-8 py-2 text-sm font-medium transition-all duration-200";
  const activeTripButton = edit
    ? "bg-navy-900 text-white"
    : "bg-white/30 text-white font-semibold";
  const inactiveTripButton = edit
    ? "bg-navy-800/60 text-white/70 hover:bg-navy-800"
    : "bg-white/10 text-white/70 hover:bg-white/20";

  return (
    <div className="flex flex-col">
      {/* Trip type tabs */}
      <div className="flex items-center rounded-t-xl overflow-hidden w-fit">
        <button
          onClick={() => {
            dispatch(setTripTypeBooking("oneway"));
            dispatch(setReturning(false));
          }}
          className={`${tripButtonBase} ${!returning ? activeTripButton : inactiveTripButton}`}
        >
          One Way
        </button>
        <button
          onClick={() => {
            dispatch(setTripTypeBooking("returning"));
            dispatch(setReturning(true));
          }}
          className={`${tripButtonBase} ${returning ? activeTripButton : inactiveTripButton}`}
        >
          Return
        </button>
      </div>

      {/* Main search card */}
      <div className={`flex flex-col gap-0 ${edit ? "bg-white border border-slate-200 rounded-xl rounded-tl-none shadow-[0_8px_32px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.08)]" : "bg-white rounded-xl rounded-tl-none shadow-[0_8px_32px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.08)]"}`}>
        {/* Recent searches */}
        {!loading ? (
          recentSearches.length > 0 && (
            <div className="flex flex-col gap-2 px-4 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recent searches
              </p>
              <div className="flex flex-row overflow-x-scroll py-1 scrollbar-hide items-center gap-2">
                {recentSearches.map((item, index) => (
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
          <div className="flex flex-col gap-2 px-4 pt-4">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-2 overflow-x-scroll scrollbar-hide py-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="shrink-0 h-14 w-[180px] rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Search fields */}
        <div className="flex flex-col p-3 md:p-4 gap-3">
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Origin / destination */}
            <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <AirportPicker direction="from" />
              <button
                onClick={() => {
                  dispatch(setFrom(to));
                  dispatch(setTo(from));
                }}
                title="Swap airports"
                className="self-center p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <ArrowLeftRight size={14} className="text-slate-500" />
              </button>
              <AirportPicker direction="to" />
            </div>

            {/* Dates + passengers */}
            <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <DatePicker />
              {returning && <DatePicker type="return" />}
              <PassengerPicker />
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between px-3 md:px-4 pb-3 md:pb-4">
          {edit && setSearchVisible && (
            <button
              onClick={() => setSearchVisible(false)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <div className="flex flex-1 items-center justify-end gap-4">
            <button
              onClick={() => dispatch(resetSearch())}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-500 transition-colors"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <button
              data-test="search-button"
              disabled={
                from.city === "" ||
                to.city === "" ||
                departureDate === "" ||
                (returning && returningDate === "")
              }
              onClick={() => {
                setSearchState(searchState);
                setBookingState(bookingState);
                saveRecentSearch(searchState);
                if (edit) {
                  router.refresh();
                } else {
                  router.push("/booking/availability");
                }
              }}
              className="flex items-center gap-2 py-2.5 px-6 md:px-10 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Search size={16} />
              Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
