import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    bookings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: [] },
    ],
  },
  { timestamps: true }
);

// Export User Model

export default mongoose.models.User || mongoose.model("User", UserSchema);
