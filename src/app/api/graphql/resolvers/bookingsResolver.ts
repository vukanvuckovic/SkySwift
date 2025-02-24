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

        if (!userJwt) return;

        const decoded: any = jwt.verify(userJwt.value, process.env.JWT_SECRET!);

        const userWithBookings = await User.findById(decoded.id).populate({
          path: "bookings",
          model: Booking,
          populate: [
            {
              path: "flights.going.flight",
              model: FlightModel,
              populate: {
                path: "plane",
                model: Plane,
              },
            },
            {
              path: "flights.returning.flight",
              model: FlightModel,
              populate: {
                path: "plane",
                model: Plane,
              },
            },
            {
              path: "passengers.seats.flight",
              model: FlightModel,
              populate: {
                path: "plane",
                model: Plane,
              },
            },
            {
              path: "passengers.meals.flight",
              model: FlightModel,
              populate: {
                path: "plane",
                model: Plane,
              },
            },
            {
              path: "passengers.luggage.flight",
              model: FlightModel,
              populate: {
                path: "plane",
                model: Plane,
              },
            },
          ],
        });

        return userWithBookings?.bookings || [];
      } catch (error: any) {
        console.error("Error fetching bookings:", error);
      }
    },
    bookingStatus: async () => {
      try {
        const token = (await cookies()).get("booking-status-jwt")?.value;

        if (!token) throw new Error("Unauthorized");

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const id = decoded.bookingId;

        await connectDB();

        const booking = await Booking.findById(id).populate([
          {
            path: "flights.going.flight",
            model: FlightModel,
            populate: {
              path: "plane",
              model: Plane,
            },
          },
          {
            path: "flights.returning.flight",
            model: FlightModel,
            populate: {
              path: "plane",
              model: Plane,
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

        return booking;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    verifyBooking: async (
      _: any,
      { bookingId, contact }: { bookingId: string; contact: string }
    ) => {
      try {
        if (!bookingId || !contact) return;

        await connectDB();

        const booking = await Booking.findOne({ _id: bookingId, contact });

        if (!booking) return;

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
          maxAge: 600, // 10 minutes
        });

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    postBooking: async (_: any, { booking }: { booking: BookingState }) => {
      try {
        console.log("posting started");
        if (!booking) {
          console.log("No booking");
          return;
        }

        await connectDB();

        let currentUser = undefined;
        let sessionToken: any = undefined;

        const userJwt = (await cookies()).get("session");

        if (userJwt) {
          try {
            sessionToken = jwt.verify(userJwt.value, process.env.JWT_SECRET!);
            currentUser = await User.findById(sessionToken.id);
          } catch (error) {
            sessionToken = undefined;
            console.log("jwt error - ", error);
          }
          console.log("sessiontoke after verifying", sessionToken);
        }

        const newBooking = new Booking({
          ...booking,
          tripType:
            booking.flights.returning.length > 0 &&
            booking.tripType === "returning"
              ? "returning"
              : "oneway",
          userId: currentUser ? currentUser._id : undefined,
        });

        await newBooking.save();

        await Promise.all(
          newBooking.passengers.flatMap((passenger: Passenger) => {
            passenger.seats.map((seat: AdditionalOption) => {
              FlightModel.findByIdAndUpdate(seat.flight, {
                $addToSet: { takenSeats: seat.name },
              });
            });
          })
        );

        if (userJwt && sessionToken) {
          const updatedUser = await User.findByIdAndUpdate(
            sessionToken.id,
            { $push: { bookings: newBooking._id } },
            { new: true }
          );
        }

        return newBooking;
      } catch (error: any) {
        console.log(error);
      }
    },
  },
};
