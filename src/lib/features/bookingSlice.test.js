import { bookingSlice, BookingState } from "./bookingSlice";

const initialState = bookingSlice.getInitialState();

describe("bookingSlice reducer", () => {
  let state;

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(initialState)); // Deep clone to avoid mutations
  });

  test("should handle setTripType", () => {
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.setTripType("returning")
    );
    expect(newState.tripType).toBe("returning");
  });

  test("should handle updateBooking", () => {
    const updatedState = { ...state, contact: "updated@gmail.com", price: 200 };
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.updateBooking(updatedState)
    );
    expect(newState.contact).toBe("updated@gmail.com");
    expect(newState.price).toBe(200);
  });

  test("should handle resetBooking", () => {
    state.contact = "changed@gmail.com";
    state.price = 500;
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.resetBooking()
    );
    expect(newState).toEqual(initialState);
  });

  test("should handle setGoingFlights and calculate price", () => {
    const mockFlight = {
      flight: { id: "123" },
      flightClass: "basic",
      price: 100,
    };
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.setGoingFlights([mockFlight])
    );
    expect(newState.flights.going).toHaveLength(1);
    expect(newState.flights.going[0].flight.id).toBe("123");
    expect(newState.price).toBe(100);
  });

  test("should handle removeFlights", () => {
    state.flights.going = [
      { flight: { id: "123" }, flightClass: "basic", price: 100 },
    ];
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.removeFlights(["123"])
    );
    expect(newState.flights.going).toHaveLength(0);
  });

  test("should handle setPassengers", () => {
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.setPassengers(3)
    );
    expect(newState.passengers).toHaveLength(3);
  });

  test("should handle pushPassenger", () => {
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.pushPassenger()
    );
    expect(newState.passengers).toHaveLength(state.passengers.length + 1);
  });

  test("should handle popPassenger", () => {
    state.passengers.push({
      firstName: "Test",
      lastName: "User",
      email: "test@gmail.com",
      dateOfBirth: "2005-20-11",
      gender: "male",
      phone: "123123123",
      seats: [],
      meals: [],
      luggage: [],
    });
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.popPassenger()
    );
    expect(newState.passengers).toHaveLength(state.passengers.length - 1);
  });

  test("should handle setFirstName", () => {
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.setFirstName({ firstName: "John", index: 0 })
    );
    expect(newState.passengers[0].firstName).toBe("John");
  });

  test("should handle setLastName", () => {
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.setLastName({ lastName: "Doe", index: 0 })
    );
    expect(newState.passengers[0].lastName).toBe("Doe");
  });

  test("should handle setEmail", () => {
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.setEmail({ email: "newemail@gmail.com", index: 0 })
    );
    expect(newState.passengers[0].email).toBe("newemail@gmail.com");
  });

  test("should handle addSeat", () => {
    const seat = { name: "Window Seat", price: 50, flight: { id: "abc" } };
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.addSeat({ seat, index: 0 })
    );
    expect(newState.passengers[0].seats).toHaveLength(1);
    expect(newState.passengers[0].seats[0].name).toBe("Window Seat");
    expect(newState.price).toBe(50);
  });

  test("should handle removeSeat", () => {
    state.passengers[0].seats.push({
      name: "Window Seat",
      price: 50,
      flight: { id: "abc" },
    });
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.removeSeat({ seatFlight: "abc", index: 0 })
    );
    expect(newState.passengers[0].seats).toHaveLength(0);
  });

  test("should handle addMeal and removeMeal", () => {
    const meal = { name: "Vegan Meal", price: 20, flight: { id: "xyz" } };
    let newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.addMeal({ meal, index: 0 })
    );
    expect(newState.passengers[0].meals).toHaveLength(1);
    expect(newState.passengers[0].meals[0].quantity).toBe(1);
    expect(newState.price).toBe(20);

    newState = bookingSlice.reducer(
      newState,
      bookingSlice.actions.removeMeal({ meal, index: 0 })
    );
    expect(newState.passengers[0].meals).toHaveLength(0);
  });

  test("should handle addLuggage and removeLuggage", () => {
    const luggage = { name: "Extra Bag", price: 30, flight: { id: "pqr" } };
    let newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.addLuggage({ luggage, index: 0 })
    );
    expect(newState.passengers[0].luggage).toHaveLength(1);
    expect(newState.price).toBe(30);

    newState = bookingSlice.reducer(
      newState,
      bookingSlice.actions.removeLuggage({ luggage, index: 0 })
    );
    expect(newState.passengers[0].luggage).toHaveLength(0);
  });

  test("should handle setContact", () => {
    const newState = bookingSlice.reducer(
      state,
      bookingSlice.actions.setContact("contact@example.com")
    );
    expect(newState.contact).toBe("contact@example.com");
  });
});
