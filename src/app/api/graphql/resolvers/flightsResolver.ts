import { BookingFlight } from "@/lib/features/bookingSlice";
import { connectDB } from "@/mongodb/connection";
import Flight from "@/mongodb/models/Flight";
import Plane from "@/mongodb/models/Plane";

export const flightsResolvers = {
  Query: {
    searchFlights: async (
      _: any,
      { from, to, returning }: { from: string; to: string; returning: boolean }
    ) => {
      try {
        await connectDB();

        const directFlights = await Flight.find({
          "from.city": from,
          "to.city": to,
        }).populate({
          path: "plane",
          model: Plane,
        });

        const flightsFrom = await Flight.find({ "from.city": from }).populate({
          path: "plane",
          model: Plane,
        });
        const flightsTo = await Flight.find({ "to.city": to }).populate({
          path: "plane",
          model: Plane,
        });

        let connectedFlights = <BookingFlight[][]>[];

        flightsFrom.forEach((flightFrom) => {
          flightsTo.forEach((flightTo) => {
            if (
              flightFrom.to.city === flightTo.from.city &&
              flightFrom.arrival < flightTo.departure
            ) {
              connectedFlights.push(
                //   {
                //   connectingCity: flightFrom.to.city,
                //   flight1: flightFrom,
                //   flight2: flightTo,
                // }
                [flightFrom, flightTo]
              );
            }
          });
        });

        let returningDirectFlights = [];
        let returningConnectedFlights = <BookingFlight[][]>[];

        if (returning) {
          returningDirectFlights = await Flight.find({
            "from.city": to,
            "to.city": from,
          }).populate({
            path: "plane",
            model: Plane,
          });

          const returningFlightsFrom = await Flight.find({
            "from.city": to,
          }).populate({
            path: "plane",
            model: Plane,
          });
          const returningFlightsTo = await Flight.find({
            "to.city": from,
          }).populate({
            path: "plane",
            model: Plane,
          });

          returningFlightsFrom.forEach((returningFlightFrom) => {
            returningFlightsTo.forEach((returningFlightTo) => {
              if (
                returningFlightFrom.to.city === returningFlightTo.from.city &&
                returningFlightFrom.arrival < returningFlightTo.departure
              ) {
                returningConnectedFlights.push(
                  // {
                  // connectingCity: returningFlightFrom.to.city,
                  // flight1: returningFlightFrom,
                  // flight2: returningFlightTo,
                  // }
                  [returningFlightFrom, returningFlightTo]
                );
              }
            });
          });
        }

        return {
          directFlights,
          connectedFlights,
          returningDirectFlights,
          returningConnectedFlights,
        };
      } catch (error: any) {
        throw new Error("Error getting flights: " + error.message);
      }
    },
  },
};
