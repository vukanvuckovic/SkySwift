import mongoose from "mongoose";
import { Schema } from "mongoose";

const FlightSchema = new Schema({
  flight: { type: Schema.Types.ObjectId, ref: "Flight" },
  flightClass: { type: String, enum: ["basic", "ecojet", "flex", "premium"] },
  price: { type: Number },
});

const AdditionalOptionSchema = new Schema(
  {
    name: { type: String },
    price: { type: Number },
    flight: { type: Schema.Types.ObjectId, ref: "Flight" },
    quantity: { type: Number },
  },
  { _id: false }
);

const PassengerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  seats: { type: [AdditionalOptionSchema], default: [] },
  meals: { type: [AdditionalOptionSchema], default: [] },
  luggage: { type: [AdditionalOptionSchema], default: [] },
});

const BookingSchema = new Schema({
  flights: {
    going: { type: [FlightSchema], required: true, default: [] },
    returning: { type: [FlightSchema], default: [] },
  },
  passengers: { type: [PassengerSchema], required: true },
  contact: { type: String, required: true },
  price: { type: Number, required: true },
  tripType: { type: String, enum: ["oneway", "returning"] },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
