import { setPassengers } from "@/lib/features/bookingSlice";
import { SearchState, updateSearch } from "@/lib/features/searchSlice";
import { removeRecentSearch } from "@/lib/localStorage";
import { formatDate } from "@/lib/utils";
import { ArrowRight, X } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

const RecentSearch = ({
  searchData,
  setRecentSearches,
  index,
}: {
  searchData: SearchState;
  setRecentSearches: (fn: (prev: SearchState[]) => SearchState[]) => void;
  index: number;
}) => {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        dispatch(updateSearch(searchData));
        dispatch(setPassengers(searchData.passengers));
      }}
      className="flex flex-col px-3 py-2.5 gap-1.5 border border-slate-200 rounded-lg relative group cursor-pointer hover:border-sky-300 hover:bg-sky-50/50 transition-all duration-150 flex-shrink-0 min-w-[160px]"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setRecentSearches((prev) => prev.filter((item) => item !== searchData));
          removeRecentSearch(searchData);
        }}
        className="hidden group-hover:flex items-center justify-center p-1 rounded-full border border-slate-200 bg-white absolute -top-1.5 -right-1.5 shadow-sm hover:border-red-200 hover:bg-red-50 transition-colors"
      >
        <X size={9} className="text-slate-400" />
      </button>

      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        <span className="truncate">{searchData.from.city}</span>
        <ArrowRight size={12} className="text-sky-500 flex-shrink-0" />
        <span className="truncate">{searchData.to.city}</span>
      </div>

      <span className="text-[10px] text-slate-400">
        {formatDate(new Date(searchData.departureDate.toString()))}
        {searchData.returningDate !== "" &&
          ` – ${formatDate(new Date(searchData.returningDate.toString()))}`}
        {" · "}
        {searchData.passengers} pax
      </span>
    </div>
  );
};

export default RecentSearch;
