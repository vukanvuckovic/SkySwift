import {
  AdditionalOption,
  Flight,
  Passenger,
} from "@/lib/features/bookingSlice";
import { connectDB } from "@/mongodb/connection";
import Booking from "@/mongodb/models/Booking";
import User from "@/mongodb/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Plane from "@/mongodb/models/Plane";
import FlightModel from "@/mongodb/models/Flight";

export async function POST(request: NextRequest) {
  try {
    const { booking } = await request.json();

    if (!booking)
      return NextResponse.json({ error: "No Booking passed" }, { status: 500 });

    await connectDB();

    const newBooking = new Booking({
      tripType: booking.tripType,
      flights: {
        going: booking.flights.going.map((item: Flight) => ({
          ///mozda bookingflight
          ...item,
          flight: item.flight._id,
        })),
        returning: booking.flights.returning.map((item: Flight) => ({
          ...item,
          flight: item.flight._id,
        })),
      },
      passengers: booking.passengers.map((passenger: Passenger) => ({
        ...passenger,
        seats: passenger.seats.map((seat: AdditionalOption) => ({
          ...seat,
          flight: seat.flight._id,
        })),
        luggage: passenger.luggage.map((luggage: AdditionalOption) => ({
          ...luggage,
          flight: luggage.flight._id,
        })),
        meals: passenger.meals.map((meal: AdditionalOption) => ({
          ...meal,
          flight: meal.flight._id,
        })),
      })),
      contact: booking.contact,
      price: booking.price,
    });

    await newBooking.save();

    await Promise.all(
      newBooking.passengers.flatMap((passenger: Passenger) =>
        passenger.seats.map((seat: AdditionalOption) =>
          FlightModel.findByIdAndUpdate(seat.flight._id, {
            $addToSet: { takenSeats: seat.name },
          })
        )
      )
    );

    const userJwt = (await cookies()).get("session");

    if (userJwt) {
      const decoded = jwt.verify(userJwt.value, process.env.JWT_SECRET!) as { id: string };
      await User.findByIdAndUpdate(
        decoded.id,
        { $push: { bookings: newBooking._id } },
        { new: true } // Ensures you get the updated document
      );
    }

    return NextResponse.json(
      { message: "Booking created.", newBooking },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB(); // Ensure database connection

    const { searchParams } = new URL(req.url); // ✅ Correctly extract searchParams
    const id = searchParams.get("id"); // ✅ No need for await

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(id).populate([
      {
        path: "flights.going.flight",
        model: FlightModel,
        populate: {
          path: "plane",
          model: Plane, // Populates the 'plane' field inside 'flight'
        },
      },
      {
        path: "flights.returning.flight",
        model: FlightModel,
        populate: {
          path: "plane",
          model: Plane, // Populates the 'plane' field inside 'flight'
        },
      },
      {
        path: "passengers.seats.flight",
        model: FlightModel,
      },
      {
        path: "passengers.meals.flight",
        model: FlightModel,
      },
      {
        path: "passengers.luggage.flight",
        model: FlightModel,
      },
    ]);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
