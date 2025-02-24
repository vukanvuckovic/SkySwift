import mongoose from "mongoose";
import { Schema } from "mongoose";

const SeatSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    benefits: { type: [String], required: true },
    rowsFrom: { type: Number, required: true },
    rowsTo: { type: Number, required: true },
  },
  { _id: false }
);

const PlaneSchema = new Schema({
  name: { type: String, required: true },
  ailes: { type: [String], required: true },
  seats: { type: [SeatSchema], required: true },
});

export default mongoose.models.Plane || mongoose.model("Plane", PlaneSchema);
