import mongoose from "mongoose";

const MONGODB_URI = process.env.CONNECTION_URL!;

if (!MONGODB_URI) {
  throw new Error("Please define the CONNECTION_URL in .env.local");
}

let seeded = false;

export const connectDB = async () => {
  const alreadyConnected = mongoose.connection.readyState >= 1;

  if (!alreadyConnected) {
    try {
      await mongoose.connect(MONGODB_URI, {
        dbName: "FlightBooking",
        serverApi: { version: "1", strict: true, deprecationErrors: true },
      });
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }

  if (!seeded) {
    seeded = true;
    const { autoSeedIfEmpty } = await import("@/lib/seed");
    await autoSeedIfEmpty();
  }
};
