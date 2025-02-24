import searchReducer, {
  setFrom,
  updateSearch,
  resetSearch,
  setTo,
  setReturning,
  setDepartureDate,
  setReturningDate,
  setPassengers,
  incrementPassengers,
  decrementPassengers,
} from "./searchSlice";

const initialState = {
  from: { city: "", airport: { name: "", id: "" } },
  to: { city: "", airport: { name: "", id: "" } },
  returning: false,
  departureDate: "",
  returningDate: "",
  passengers: 1,
};

describe("searchSlice reducer", () => {
  it("should return the initial state when passed an unknown action", () => {
    expect(searchReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should reset search state", () => {
    const modifiedState = { ...initialState, passengers: 3 };
    expect(searchReducer(modifiedState, resetSearch())).toEqual(initialState);
  });

  it("should update search state", () => {
    const newState = {
      ...initialState,
      from: { city: "New York", airport: { name: "JFK", id: "JFK" } },
      to: { city: "Los Angeles", airport: { name: "LAX", id: "LAX" } },
    };
    expect(searchReducer(initialState, updateSearch(newState))).toEqual(
      newState
    );
  });

  it("should update 'from' location", () => {
    const payload = { city: "Paris", airport: { name: "CDG", id: "CDG" } };
    expect(searchReducer(initialState, setFrom(payload)).from).toEqual(payload);
  });

  it("should update 'to' location", () => {
    const payload = { city: "London", airport: { name: "LHR", id: "LHR" } };
    expect(searchReducer(initialState, setTo(payload)).to).toEqual(payload);
  });

  it("should update returning flag", () => {
    expect(searchReducer(initialState, setReturning(true)).returning).toBe(
      true
    );
  });

  it("should update departure date", () => {
    expect(
      searchReducer(initialState, setDepartureDate("2025-06-01")).departureDate
    ).toBe("2025-06-01");
  });

  it("should update returning date", () => {
    expect(
      searchReducer(initialState, setReturningDate("2025-06-10")).returningDate
    ).toBe("2025-06-10");
  });

  it("should update passengers count", () => {
    expect(searchReducer(initialState, setPassengers(4)).passengers).toBe(4);
  });

  it("should increment passengers count", () => {
    expect(
      searchReducer({ ...initialState, passengers: 2 }, incrementPassengers())
        .passengers
    ).toBe(3);
    expect(
      searchReducer({ ...initialState, passengers: 10 }, incrementPassengers())
        .passengers
    ).toBe(10);
  });

  it("should decrement passengers count", () => {
    expect(
      searchReducer({ ...initialState, passengers: 3 }, decrementPassengers())
        .passengers
    ).toBe(2);
    expect(searchReducer(initialState, decrementPassengers()).passengers).toBe(
      1
    );
  });
});
