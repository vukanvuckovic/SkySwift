import { Airplane, ArrowDown2 } from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setFrom, setTo } from "@/lib/features/searchSlice";
import { airports } from "@/constants/airports";

const SuggestionsPopover = ({
  open,
  direction,
  searchValue,
}: {
  open: boolean;
  direction: "from" | "to";
  searchValue: string;
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState(airports);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    setFilteredSuggestions(
      airports.filter(
        (item) =>
          item.city.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  const dispatch = useDispatch();

  return (
    open &&
    searchValue.trim() !== "" && (
      <ul className="flex flex-col gap-1 p-1 rounded-[10px] w-full max-h-[400px] overflow-y-scroll bg-white shadow-md shadow-gray-200 border-[1px] border-gray-200 absolute -top-5 left-0 -translate-y-[100%] z-50">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((item, index) => (
            <li key={index}>
              <button
                onMouseDown={() => {
                  if (direction === "from") {
                    dispatch(
                      setFrom({
                        city: item.city,
                        airport: {
                          name: item.name,
                          id: item.id,
                        },
                      })
                    );
                  } else {
                    dispatch(
                      setTo({
                        city: item.city,
                        airport: {
                          name: item.name,
                          id: item.id,
                        },
                      })
                    );
                  }
                }}
                className="w-full flex flex-col items-start p-2 rounded-[6px] hover:bg-gray-100 duration-200"
              >
                <span data-test="airport-picker-option">
                  {item.city} ({item.id})
                </span>
                <span className="text-sm text-gray-500 text-left">
                  {item.name}
                </span>
              </button>
            </li>
          ))
        ) : (
          <span className="p-2 text-center text-gray-500">Nothing Found</span>
        )}
      </ul>
    )
  );
};

const AirportPicker = ({ direction }: { direction: "from" | "to" }) => {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { from, to } = useSelector((state: RootState) => state.search);

  const inputElement = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => {
        inputElement.current?.focus();
        setSuggestionsOpen(true);
      }}
      className="flex-1 flex flex-row items-center gap-3 border-[1px] border-gray-200 rounded-lg px-4 py-3 relative"
    >
      <SuggestionsPopover
        searchValue={searchVal}
        open={suggestionsOpen}
        direction={direction}
      />
      <Airplane
        size={24}
        color="gray"
      />
      <div className="flex-1 flex flex-col">
        <label
          htmlFor="flyingFrom"
          className="max-md:text-sm font-medium text-gray-500 leading-none"
        >
          {direction === "from" ? "From" : "To"}
        </label>
        <input
          ref={inputElement}
          name="flyingFrom"
          data-test={
            direction === "from" ? "from-airport-picker" : "to-airport-picker"
          }
          type="text"
          autoComplete="off"
          placeholder={
            direction === "from"
              ? from.city !== ""
                ? `${from.city} (${from.airport.id})`
                : "Please Select"
              : direction === "to"
              ? to.city !== ""
                ? `${to.city} (${to.airport.id})`
                : "Please Select"
              : "Please Select"
          }
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className={`max-md:text-sm xl:text-lg focus:outline-none ${
            ((direction === "from" && from.city !== "") ||
              (direction === "to" && to.city !== "")) &&
            "placeholder-blue-500 font-medium"
          } `}
          onFocus={() => setSuggestionsOpen(true)}
          onBlur={() => {
            setSuggestionsOpen(false);
            setSearchVal("");
          }}
        />
      </div>
      <ArrowDown2
        size={12}
        color="blue"
      />
    </div>
  );
};

export default AirportPicker;
