import jwt from "jsonwebtoken";
import { connectDB } from "@/mongodb/connection";
import Booking from "@/mongodb/models/Booking";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Flight from "@/mongodb/models/Flight";
import Plane from "@/mongodb/models/Plane";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { bookingId, contact } = await req.json();

    if (!bookingId || !contact)
      return NextResponse.json({ error: "Not enough data" }, { status: 500 });

    await connectDB();

    const booking = await Booking.findOne({ _id: bookingId, contact });

    if (!booking) {
      return NextResponse.json(
        { message: "Invalid booking ID or email" },
        { status: 400 }
      );
    }

    // Create JWT token containing booking ID
    const token = jwt.sign(
      { bookingId: booking._id, contact: booking.contact },
      JWT_SECRET,
      { expiresIn: "10m" } // Token expires in 10 minutes
    );

    (await cookies()).set("booking-status-jwt", token, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const token = (await cookies()).get("booking-status-jwt")?.value;

    if (!token) {
      return redirect("/");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { bookingId: string };

    const id = decoded.bookingId;

    await connectDB();

    const booking = await Booking.findById(id).populate([
      {
        path: "flights.going.flight",
        model: Flight,
        populate: {
          path: "plane",
          model: Plane, // Populates the 'plane' field inside 'flight'
        },
      },
      {
        path: "flights.returning.flight",
        model: Flight,
        populate: {
          path: "plane",
          model: Plane, // Populates the 'plane' field inside 'flight'
        },
      },
      {
        path: "passengers.seats.flight",
        model: Flight,
      },
      {
        path: "passengers.meals.flight",
        model: Flight,
      },
      {
        path: "passengers.luggage.flight",
        model: Flight,
      },
    ]);

    if (!booking)
      return NextResponse.json({ error: "No booking found" }, { status: 400 });

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
