import mongoose from "mongoose";
import { airports } from "@/constants/airports";
import Flight from "@/mongodb/models/Flight";
import Plane from "@/mongodb/models/Plane";

const PLANES = [
  {
    _id: new mongoose.Types.ObjectId("67b3ae65d41bce782afdd5c0"),
    name: "Boeing 737-800",
    ailes: ["A", "B", "C", "D", "E", "F"],
    seats: [
      {
        name: "basic",
        price: 0,
        benefits: ["Standard seat", "Personal item included"],
        rowsFrom: 16,
        rowsTo: 30,
      },
      {
        name: "ecojet",
        price: 30,
        benefits: ["Extra legroom", "Carry-on bag", "Snack & drink"],
        rowsFrom: 9,
        rowsTo: 15,
      },
      {
        name: "flex",
        price: 70,
        benefits: [
          "Preferred seat",
          "2 checked bags",
          "Flexible rebooking",
          "Meal included",
        ],
        rowsFrom: 4,
        rowsTo: 8,
      },
      {
        name: "premium",
        price: 150,
        benefits: [
          "Business class seat",
          "Lounge access",
          "3 checked bags",
          "Gourmet dining",
          "Priority check-in",
        ],
        rowsFrom: 1,
        rowsTo: 3,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("67b3ae80d41bce782afdd5c2"),
    name: "Airbus A320neo",
    ailes: ["A", "B", "C", "D", "E", "F"],
    seats: [
      {
        name: "basic",
        price: 0,
        benefits: ["Standard seat", "Personal item included"],
        rowsFrom: 16,
        rowsTo: 32,
      },
      {
        name: "ecojet",
        price: 35,
        benefits: ["Extra legroom", "Carry-on bag", "Snack & drink"],
        rowsFrom: 9,
        rowsTo: 15,
      },
      {
        name: "flex",
        price: 75,
        benefits: [
          "Preferred seat",
          "2 checked bags",
          "Flexible rebooking",
          "Meal included",
        ],
        rowsFrom: 4,
        rowsTo: 8,
      },
      {
        name: "premium",
        price: 160,
        benefits: [
          "Business class seat",
          "Lounge access",
          "3 checked bags",
          "Gourmet dining",
          "Priority check-in",
        ],
        rowsFrom: 1,
        rowsTo: 3,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("67b3ae92d41bce782afdd5c4"),
    name: "Boeing 777-300ER",
    ailes: ["A", "B", "C", "D", "E", "F", "G", "H", "J"],
    seats: [
      {
        name: "basic",
        price: 0,
        benefits: ["Standard seat", "Personal item included"],
        rowsFrom: 21,
        rowsTo: 50,
      },
      {
        name: "ecojet",
        price: 40,
        benefits: [
          "Extra legroom",
          "Carry-on bag",
          "Meal & drinks included",
        ],
        rowsFrom: 11,
        rowsTo: 20,
      },
      {
        name: "flex",
        price: 90,
        benefits: [
          "Preferred seat",
          "2 checked bags",
          "Flexible rebooking",
          "Premium meal",
          "Priority boarding",
        ],
        rowsFrom: 5,
        rowsTo: 10,
      },
      {
        name: "premium",
        price: 200,
        benefits: [
          "Lie-flat business seat",
          "Lounge access",
          "3 checked bags",
          "Multi-course dining",
          "Dedicated cabin crew",
          "Amenity kit",
        ],
        rowsFrom: 1,
        rowsTo: 4,
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("67b3aea1d41bce782afdd5c6"),
    name: "Airbus A380",
    ailes: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
    seats: [
      {
        name: "basic",
        price: 0,
        benefits: ["Standard seat", "Personal item included"],
        rowsFrom: 26,
        rowsTo: 60,
      },
      {
        name: "ecojet",
        price: 45,
        benefits: [
          "Extra legroom",
          "Carry-on bag",
          "Meal & drinks included",
        ],
        rowsFrom: 14,
        rowsTo: 25,
      },
      {
        name: "flex",
        price: 100,
        benefits: [
          "Preferred seat",
          "2 checked bags",
          "Flexible rebooking",
          "Premium meal",
          "Priority boarding",
        ],
        rowsFrom: 6,
        rowsTo: 13,
      },
      {
        name: "premium",
        price: 220,
        benefits: [
          "Lie-flat suite",
          "Private lounge access",
          "3 checked bags",
          "Chef-curated dining",
          "Dedicated concierge",
          "Luxury amenity kit",
          "On-demand bar",
        ],
        rowsFrom: 1,
        rowsTo: 5,
      },
    ],
  },
];

const PLANE_IDS = PLANES.map((p) => p._id);

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFlightTimes() {
  const departure = new Date();
  departure.setDate(departure.getDate() + Math.floor(Math.random() * 30) + 1);
  departure.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    0,
    0
  );
  const arrival = new Date(departure);
  arrival.setHours(arrival.getHours() + Math.floor(Math.random() * 10 + 1));
  arrival.setMinutes(arrival.getMinutes() + Math.floor(Math.random() * 60));
  return { departure, arrival };
}

export async function seedDatabase(): Promise<void> {
  await Flight.deleteMany({});
  await Plane.deleteMany({});
  await Plane.insertMany(PLANES);

  const flights = [];

  for (let i = 0; i < 500; i++) {
    let from, to;
    do {
      from = getRandomItem(airports);
      to = getRandomItem(airports);
    } while (from.id === to.id);

    const { departure, arrival } = generateFlightTimes();

    flights.push({
      from: {
        city: from.city,
        airport: { name: from.name, id: from.id },
      },
      to: {
        city: to.city,
        airport: { name: to.name, id: to.id },
      },
      plane: getRandomItem(PLANE_IDS),
      departure,
      arrival,
      takenSeats: [],
      pricing: {
        basic: {
          benefits: ["Standard seat", "Personal item included"],
          price: Math.floor(Math.random() * 30 + 50),
        },
        ecojet: {
          benefits: ["Extra legroom", "Carry-on bag", "Snack & drink"],
          price: Math.floor(Math.random() * 50 + 90),
        },
        flex: {
          benefits: [
            "Preferred seat",
            "2 checked bags",
            "Flexible rebooking",
            "Meal included",
          ],
          price: Math.floor(Math.random() * 70 + 150),
        },
        premium: {
          benefits: [
            "Business class seat",
            "Lounge access",
            "3 checked bags",
            "Gourmet dining",
            "Priority check-in",
          ],
          price: Math.floor(Math.random() * 150 + 300),
        },
      },
    });
  }

  await Flight.insertMany(flights);
}

export async function autoSeedIfEmpty(): Promise<void> {
  const count = await Flight.countDocuments();
  if (count === 0) {
    await seedDatabase();
  }
}
