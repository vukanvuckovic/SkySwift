import { connectDB } from "@/mongodb/connection";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/mongodb/models/User";
import Booking from "@/mongodb/models/Booking";
import FlightModel from "@/mongodb/models/Flight";
import Plane from "@/mongodb/models/Plane";
import {
  AdditionalOption,
  BookingState,
  Passenger,
} from "@/lib/features/bookingSlice";

export const bookingsResolver = {
  Query: {
    getMyBookings: async () => {
      try {
        await connectDB();

        const cookieStore = cookies();
        const userJwt = (await cookieStore).get("session");

        if (!userJwt) return [];

        const decoded = jwt.verify(
          userJwt.value,
          process.env.JWT_SECRET!
        ) as { id: string };

        const userWithBookings = await User.findById(decoded.id).populate({
          path: "bookings",
          model: Booking,
          populate: [
            {
              path: "flights.going.flight",
              model: FlightModel,
              populate: { path: "plane", model: Plane },
            },
            {
              path: "flights.returning.flight",
              model: FlightModel,
              populate: { path: "plane", model: Plane },
            },
            {
              path: "passengers.seats.flight",
              model: FlightModel,
              populate: { path: "plane", model: Plane },
            },
            {
              path: "passengers.meals.flight",
              model: FlightModel,
              populate: { path: "plane", model: Plane },
            },
            {
              path: "passengers.luggage.flight",
              model: FlightModel,
              populate: { path: "plane", model: Plane },
            },
          ],
        });

        return userWithBookings?.bookings ?? [];
      } catch (error: unknown) {
        console.error("Error fetching bookings:", error);
        return [];
      }
    },
    bookingStatus: async () => {
      try {
        const token = (await cookies()).get("booking-status-jwt")?.value;

        if (!token) throw new Error("Unauthorized");

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          bookingId: string;
        };

        await connectDB();

        const booking = await Booking.findById(decoded.bookingId).populate([
          {
            path: "flights.going.flight",
            model: FlightModel,
            populate: { path: "plane", model: Plane },
          },
          {
            path: "flights.returning.flight",
            model: FlightModel,
            populate: { path: "plane", model: Plane },
          },
          { path: "passengers.seats.flight", model: FlightModel },
          { path: "passengers.meals.flight", model: FlightModel },
          { path: "passengers.luggage.flight", model: FlightModel },
        ]);

        return booking ?? null;
      } catch (error: unknown) {
        console.error("Error fetching booking status:", error);
        return null;
      }
    },
  },
  Mutation: {
    verifyBooking: async (
      _: unknown,
      { bookingId, contact }: { bookingId: string; contact: string }
    ) => {
      try {
        if (!bookingId || !contact) return false;

        await connectDB();

        const booking = await Booking.findOne({ _id: bookingId, contact });
        if (!booking) return false;

        const token = jwt.sign(
          { bookingId: booking._id, contact: booking.contact },
          process.env.JWT_SECRET!,
          { expiresIn: "10m" }
        );

        const cookieStore = await cookies();
        cookieStore.delete("booking-status-jwt");
        cookieStore.set("booking-status-jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 600,
        });

        return true;
      } catch (error: unknown) {
        console.error("Error verifying booking:", error);
        return false;
      }
    },
    postBooking: async (_: unknown, { booking }: { booking: BookingState }) => {
      try {
        if (!booking) return null;

        await connectDB();

        let currentUserId: string | undefined;

        const userJwt = (await cookies()).get("session");

        if (userJwt) {
          try {
            const decoded = jwt.verify(
              userJwt.value,
              process.env.JWT_SECRET!
            ) as { id: string };
            currentUserId = decoded.id;
          } catch {
            currentUserId = undefined;
          }
        }

        const newBooking = new Booking({
          ...booking,
          tripType:
            booking.flights.returning.length > 0 &&
            booking.tripType === "returning"
              ? "returning"
              : "oneway",
          userId: currentUserId,
        });

        await newBooking.save();

        await Promise.all(
          newBooking.passengers.flatMap((passenger: Passenger) =>
            passenger.seats.map((seat: AdditionalOption) =>
              FlightModel.findByIdAndUpdate(seat.flight, {
                $addToSet: { takenSeats: seat.name },
              })
            )
          )
        );

        if (currentUserId) {
          await User.findByIdAndUpdate(
            currentUserId,
            { $push: { bookings: newBooking._id } },
            { new: true }
          );
        }

        return newBooking;
      } catch (error: unknown) {
        console.error("Error posting booking:", error);
        return null;
      }
    },
  },
};
