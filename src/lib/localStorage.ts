import { BookingState } from "./features/bookingSlice";
import { SearchState } from "./features/searchSlice";

const matchesSearch = (item: SearchState, term: SearchState) =>
  item.from.city === term.from.city &&
  item.to.city === term.to.city &&
  item.departureDate === term.departureDate &&
  item.returningDate === term.returningDate;

export const setSearchState = (searchState: SearchState) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("searchState", JSON.stringify(searchState));
  } catch {
    // storage unavailable
  }
};

export const setBookingState = (bookingState: BookingState) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bookingState", JSON.stringify(bookingState));
  } catch {
    // storage unavailable
  }
};

export const getSearchState = (): SearchState | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const data = localStorage.getItem("searchState");
    return data ? JSON.parse(data) : undefined;
  } catch {
    return undefined;
  }
};

export const getBookingState = (): BookingState | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const data = localStorage.getItem("bookingState");
    return data ? JSON.parse(data) : undefined;
  } catch {
    return undefined;
  }
};

export const saveRecentSearch = (searchTerm: SearchState) => {
  if (typeof window === "undefined") return;
  const MAX_RECENT_SEARCHES = 10;
  const stored: SearchState[] = JSON.parse(localStorage.getItem("recentSearches") || "[]");
  const updated = [
    searchTerm,
    ...stored.filter((item) => !matchesSearch(item, searchTerm)),
  ].slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem("recentSearches", JSON.stringify(updated));
};

export const removeRecentSearch = (searchTerm: SearchState) => {
  if (typeof window === "undefined") return;
  const stored: SearchState[] = JSON.parse(localStorage.getItem("recentSearches") || "[]");
  const updated = stored.filter((item) => !matchesSearch(item, searchTerm));
  localStorage.setItem("recentSearches", JSON.stringify(updated));
};
