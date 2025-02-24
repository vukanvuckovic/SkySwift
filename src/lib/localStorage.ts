import { BookingState } from "./features/bookingSlice";
import { SearchState } from "./features/searchSlice";

export const setSearchState = (searchState: SearchState) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("searchState", JSON.stringify(searchState));
  } catch (error) {
    console.log("Error saving search state: ", error);
  }
};

export const setBookingState = (bookingState: BookingState) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("bookingState", JSON.stringify(bookingState));
  } catch (error) {
    console.log("Error saving booking state: ", error);
  }
};

export const getSearchState = () => {
  if (typeof window === "undefined") return;

  try {
    const searchData = localStorage.getItem("searchState");
    return searchData ? JSON.parse(searchData) : undefined;
  } catch (error) {
    console.log("Error getting search state: ", error);
  }
};

export const getBookingState = () => {
  if (typeof window === "undefined") return;
  try {
    const bookingState = localStorage.getItem("bookingState");
    return bookingState ? JSON.parse(bookingState) : undefined;
  } catch (error) {
    console.log("Error getting booking state: ", error);
  }
};

export const saveRecentSearch = (searchTerm: SearchState) => {
  if (typeof window === "undefined") return;

  const maxRecentSearches = 10; // Limit the stored searches

  // Get existing searches from localStorage
  const storedSearches = JSON.parse(
    localStorage.getItem("recentSearches") || "[]"
  );

  // Remove duplicate and limit the array size
  const updatedSearches = [
    searchTerm,
    ...storedSearches.filter(
      (item: SearchState) =>
        item.from.city !== searchTerm.from.city ||
        item.to.city !== searchTerm.to.city ||
        item.departureDate !== searchTerm.departureDate ||
        item.returningDate !== searchTerm.returningDate
    ),
  ].slice(0, maxRecentSearches);

  // Store back in localStorage
  localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
};

export const removeRecentSearch = (searchTerm: SearchState) => {
  if (typeof window === "undefined") return;

  const storedSearches = JSON.parse(
    localStorage.getItem("recentSearches") || "[]"
  );

  const updatedSearches = storedSearches.filter(
    (item: SearchState) =>
      item.from.city !== searchTerm.from.city ||
      item.to.city !== searchTerm.to.city ||
      item.departureDate !== searchTerm.departureDate ||
      item.returningDate !== searchTerm.returningDate
  );

  localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
};
// export const getRecentSearches = () => {
//   if (typeof window === "undefined") return []; // ✅ Prevents crash on server

//   const recentSearches = localStorage.getItem("recentSearches");
//   return recentSearches ? JSON.parse(recentSearches) : [];
// };
