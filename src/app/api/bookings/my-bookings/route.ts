import { connectDB } from "@/mongodb/connection";
import User from "@/mongodb/models/User";
import Flight from "@/mongodb/models/Flight";
import Booking from "@/mongodb/models/Booking";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = cookies();
    const userJwt = (await cookieStore).get("session");

    if (!userJwt)
      return NextResponse.json({ error: "No session" }, { status: 400 });

    const decoded = jwt.verify(userJwt.value, process.env.JWT_SECRET!) as { id: string };

    const userWithBookings = await User.findById(decoded.id).populate({
      path: "bookings",
      model: Booking,
      populate: [
        { path: "flights.going.flight", model: Flight },
        { path: "flights.returning.flight", model: Flight },
        { path: "passengers.seats.flight", model: Flight },
        { path: "passengers.meals.flight", model: Flight },
        { path: "passengers.luggage.flight", model: Flight },
      ],
    });

    return NextResponse.json(
      {
        message: "Bookings fetched",
        bookings: userWithBookings?.bookings || [],
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
