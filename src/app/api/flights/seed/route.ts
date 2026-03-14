import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/mongodb/connection";
import { airports } from "@/constants/airports";
import Flight from "@/mongodb/models/Flight";

const planeIds = [
  "67b3ae65d41bce782afdd5c0",
  "67b3ae80d41bce782afdd5c2",
  "67b3ae92d41bce782afdd5c4",
  "67b3aea1d41bce782afdd5c6",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate() {
  const departure = new Date();
  departure.setDate(departure.getDate() + Math.floor(Math.random() * 30));
  departure.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60)
  );
  const arrival = new Date(departure);
  arrival.setHours(arrival.getHours() + Math.floor(Math.random() * 10 + 1));
  return { departure, arrival };
}

async function seedFlights() {
  await connectDB();
  console.log("✅ Database connected, starting seeding...");

  const flights = [];

  for (let i = 0; i < 500; i++) {
    let from, to;
    do {
      from = getRandomItem(airports);
      to = getRandomItem(airports);
    } while (from.id === to.id);

    const { departure, arrival } = generateRandomDate();

    const flight = {
      from: {
        city: from.city,
        airport: { name: from.name, id: from.id },
      },
      to: {
        city: to.city,
        airport: { name: to.name, id: to.id },
      },
      plane: new mongoose.Types.ObjectId(getRandomItem(planeIds)),
      departure,
      arrival,
      takenSeats: [],
      pricing: {
        basic: {
          benefits: ["Standard seat"],
          price: Math.floor(Math.random() * 30 + 50),
        },
        ecojet: {
          benefits: ["Extra legroom"],
          price: Math.floor(Math.random() * 50 + 80),
        },
        flex: {
          benefits: ["Priority boarding"],
          price: Math.floor(Math.random() * 70 + 120),
        },
        premium: {
          benefits: ["Luxury seat, gourmet meal"],
          price: Math.floor(Math.random() * 100 + 200),
        },
      },
    };

    flights.push(flight);
  }

  try {
    await Flight.insertMany(flights);
    console.log("✅ 500 Flights inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting flights:", error);
    throw error;
  }
}

// ✅ Next.js App Router requires named export `POST`
export async function POST() {
  try {
    console.log("🔥 Seeding flights...");
    await seedFlights();
    console.log("✅ Seeding complete");
    return NextResponse.json({ message: "500 flights seeded successfully!" }, { status: 201 });
  } catch (error) {
    console.error("❌ Seeding error:", error);
    return NextResponse.json({ message: "Error seeding flights" }, { status: 500 });
  }
}