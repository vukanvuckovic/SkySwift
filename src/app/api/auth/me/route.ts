import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/mongodb/models/User";
import { connectDB } from "@/mongodb/connection";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = cookies();
    const token = (await cookieStore).get("session")?.value;

    if (!token) {
      return NextResponse.json({ message: "No session" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "No user returned", error },
      { status: 401 }
    );
  }
}
