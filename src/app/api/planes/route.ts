import { connectDB } from "@/mongodb/connection";
import Plane from "@/mongodb/models/Plane";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.name || !body.ailes || !body.seats) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPlane = new Plane(body);
    await newPlane.save();

    return NextResponse.json(
      { success: true, data: newPlane },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating plane:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Plane.deleteMany({}); // Deletes all planes
    return NextResponse.json({ message: "All planes deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete planes" },
      { status: 500 }
    );
  }
}
