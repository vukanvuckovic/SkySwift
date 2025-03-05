import { PlaneLanding, PlaneTakeoff, ChevronDown } from "lucide-react";
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
      <ul className="flex flex-col p-1 rounded-xl w-full max-h-[320px] overflow-y-auto bg-white shadow-xl border border-slate-100 absolute -top-2 left-0 -translate-y-full z-50">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((item, index) => (
            <li key={index}>
              <button
                onMouseDown={() => {
                  dispatch(
                    direction === "from"
                      ? setFrom({ city: item.city, airport: { name: item.name, id: item.id } })
                      : setTo({ city: item.city, airport: { name: item.name, id: item.id } })
                  );
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-sky-600">{item.id}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-slate-800 truncate" data-test="airport-picker-option">
                    {item.city}
                  </span>
                  <span className="text-xs text-slate-400 truncate">{item.name}</span>
                </div>
              </button>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-sm text-slate-400">No airports found</li>
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

  const selected = direction === "from" ? from : to;
  const hasValue = selected.city !== "";

  const Icon = direction === "from" ? PlaneTakeoff : PlaneLanding;

  return (
    <div
      onClick={() => {
        inputElement.current?.focus();
        setSuggestionsOpen(true);
      }}
      className="flex-1 flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2.5 relative hover:border-slate-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 transition-all duration-150 bg-slate-50 cursor-text shadow-sm"
    >
      <SuggestionsPopover
        searchValue={searchVal}
        open={suggestionsOpen}
        direction={direction}
      />

      <Icon size={18} className={hasValue ? "text-sky-500" : "text-slate-300"} />

      <div className="flex-1 flex flex-col min-w-0">
        <label className="text-xs font-medium text-slate-500 leading-none mb-0.5">
          {direction === "from" ? "From" : "To"}
        </label>
        <input
          ref={inputElement}
          name={direction === "from" ? "flyingFrom" : "flyingTo"}
          data-test={direction === "from" ? "from-airport-picker" : "to-airport-picker"}
          type="text"
          autoComplete="off"
          placeholder={
            hasValue
              ? `${selected.city} (${selected.airport.id})`
              : "Search city or airport"
          }
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className={`text-sm focus:outline-none bg-transparent w-full truncate ${
            hasValue && searchVal === ""
              ? "text-sky-600 font-semibold placeholder-sky-600"
              : "text-slate-700 placeholder-slate-400"
          }`}
          onFocus={() => setSuggestionsOpen(true)}
          onBlur={() => {
            setSuggestionsOpen(false);
            setSearchVal("");
          }}
        />
      </div>

      <ChevronDown size={14} className="text-slate-300 flex-shrink-0" />
    </div>
  );
};

export default AirportPicker;
