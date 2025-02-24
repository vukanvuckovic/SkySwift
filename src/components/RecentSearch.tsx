import { setPassengers } from "@/lib/features/bookingSlice";
import { SearchState, updateSearch } from "@/lib/features/searchSlice";
import { removeRecentSearch } from "@/lib/localStorage";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "iconsax-react";
import { X } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

const RecentSearch = ({
  searchData,
  setRecentSearches,
  index,
}: {
  searchData: SearchState;
  setRecentSearches: Function;
  index: number;
}) => {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        dispatch(updateSearch(searchData));
        dispatch(setPassengers(searchData.passengers));
      }}
      className="flex flex-col px-4 md:px-6 py-3 gap-2 border-[1px] border-gray-200 rounded-lg relative group cursor-pointer"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setRecentSearches((prev: SearchState[]) =>
            prev.filter((item: SearchState) => item !== searchData)
          );
          removeRecentSearch(searchData);
        }}
        className="hidden group-hover:block duration-200 p-1 aspect-square border-[1px] border-gray-200 rounded-full absolute -top-1 -right-1 bg-white/10 backdrop-blur-xl"
      >
        <X
          size={10}
          color="gray"
        />
      </button>
      <div className="flex flex-row items-center gap-2 max-md:text-sm font-medium text-gray-600">
        <span className="leading-none truncate">{searchData.from.city}</span>
        <ArrowRight
          size={14}
          color="blue"
        />
        <span className="leading-none truncate">{searchData.to.city}</span>
      </div>
      <span className="max-md:text-[10px] text-xs text-gray-500">
        {formatDate(new Date(searchData.departureDate.toString()))}
        {searchData.returningDate !== "" &&
          ` - ` + formatDate(new Date(searchData.departureDate.toString()))}
        , {searchData.passengers} passenger
        {searchData.passengers > 1 && "s"}
      </span>
    </div>
  );
};

export default RecentSearch;
