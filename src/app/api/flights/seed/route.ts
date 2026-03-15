import { NextResponse } from "next/server";
import { connectDB } from "@/mongodb/connection";
import { seedDatabase } from "@/lib/seed";

export async function POST() {
  try {
    await connectDB();
    await seedDatabase();
    return NextResponse.json(
      { message: "Database seeded successfully with 500 flights." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ message: "Error seeding database" }, { status: 500 });
  }
}
