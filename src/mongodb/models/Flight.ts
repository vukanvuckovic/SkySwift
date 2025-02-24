import mongoose from "mongoose";
const { Schema } = mongoose;

const FlightClass = new Schema(
  {
    benefits: { type: [String], required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const FlightDestination = new Schema(
  {
    city: { type: String, required: true },
    airport: {
      name: { type: String, required: true },
      id: { type: String, required: true },
    },
  },
  { _id: false }
);

const FlightSchema = new Schema({
  from: { type: FlightDestination, required: true },
  to: { type: FlightDestination, required: true },
  plane: {
    type: Schema.Types.ObjectId,
    ref: "Plane",
    required: true,
  },
  departure: { type: Date, required: true },
  arrival: { type: Date, required: true },
  takenSeats: { type: [String], default: [] },
  pricing: {
    basic: FlightClass,
    ecojet: FlightClass,
    flex: FlightClass,
    premium: FlightClass,
  },
});

export default mongoose.models.Flight || mongoose.model("Flight", FlightSchema);
