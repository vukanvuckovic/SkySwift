import { connectDB } from "@/mongodb/connection";
import Flight from "@/mongodb/models/Flight";
import Plane from "@/mongodb/models/Plane";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  try {
    const searchParams = request.nextUrl.searchParams;
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const returning = searchParams.get("returning");

    if (!fromParam || !toParam || !returning)
      return NextResponse.json(
        { message: "Missing required data" },
        { status: 400 }
      );

    await connectDB();

    const directFlights = await Flight.find({
      "from.city": fromParam,
      "to.city": toParam,
    }).populate({ path: "plane", model: Plane });

    let connectedFlights = <ConnectedFlight[]>[];

    const flightsFrom = await Flight.find({ "from.city": fromParam }).populate({
      path: "plane",
      model: Plane,
    });
    const flightsTo = await Flight.find({ "to.city": toParam }).populate({
      path: "plane",
      model: Plane,
    });

    if (flightsFrom && flightsTo) {
      flightsFrom.forEach((flightFrom) => {
        flightsTo.forEach((flightTo) => {
          if (flightFrom.to.city === flightTo.from.city) {
            connectedFlights = [
              ...connectedFlights,
              {
                connectingCity: flightFrom.to.city,
                flight1: flightFrom,
                flight2: flightTo,
              },
            ];
          }
        });
      });
    }

    //-----------------------------------------

    let returningDirectFlights = <ConnectedFlight[]>[];
    let returningConnectedFlights = <ConnectedFlight[]>[];

    if (returning === "true") {
      returningDirectFlights = await Flight.find({
        "to.city": fromParam,
        "from.city": toParam,
      }).populate({ path: "plane", model: Plane });

      //finding connected flights

      const returningFlightsFrom = await Flight.find({
        "from.city": toParam,
      }).populate({ path: "plane", model: Plane });
      const returningFlightsTo = await Flight.find({
        "to.city": fromParam,
      }).populate({ path: "plane", model: Plane });

      if (returningFlightsFrom && returningFlightsTo) {
        returningFlightsFrom.forEach((returningFlightFrom) => {
          returningFlightsTo.forEach((returningFlightTo) => {
            if (returningFlightFrom.to.city === returningFlightTo.from.city) {
              returningConnectedFlights = [
                ...returningConnectedFlights,
                {
                  connectingCity: returningFlightFrom.to.city,
                  flight1: returningFlightFrom,
                  flight2: returningFlightTo,
                },
              ];
            }
          });
        });
      }
    }

    return NextResponse.json(
      {
        message: "Flights available",
        directFlights: directFlights,
        connectedFlights: connectedFlights,
        returningDirectFlights: returningDirectFlights,
        returningConnectedFlights: returningConnectedFlights,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error getting flights", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Flight.deleteMany({}); // Deletes all planes
    return NextResponse.json({ message: "All flights deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete planes" },
      { status: 500 }
    );
  }
}
