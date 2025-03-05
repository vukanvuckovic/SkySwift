import { connectDB } from "@/mongodb/connection";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/mongodb/models/User";
import bcrypt from "bcryptjs";

export const userResolver = {
  Query: {
    me: async () => {
      try {
        await connectDB();

        const cookieStore = cookies();
        const token = (await cookieStore).get("session")?.value;

        if (!token) return null;

        let decoded: { id: string; email: string } | undefined;

        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
          };
        } catch {
          return null;
        }

        if (!decoded) return null;

        const user = await User.findById(decoded.id).select("-password");
        return user ?? null;
      } catch {
        return null;
      }
    },
  },
  Mutation: {
    logout: async () => {
      try {
        (await cookies()).set("session", "", {
          httpOnly: true,
          expires: new Date(0),
          path: "/",
        });
        (await cookies()).delete("session");
        return true;
      } catch {
        return false;
      }
    },
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        if (!email || !password) return null;

        await connectDB();
        const user = await User.findOne({ email });

        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET as string,
          { expiresIn: "7d" }
        );

        (await cookies()).set("session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        });

        return user;
      } catch {
        return null;
      }
    },
    register: async (
      _: unknown,
      {
        firstName,
        lastName,
        email,
        password,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }
    ) => {
      try {
        if (!firstName || !lastName || !email || !password) {
          throw new Error("All fields are required.");
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });

        return newUser;
      } catch (error: unknown) {
        throw new Error(
          error instanceof Error ? error.message : "Internal Server Error"
        );
      }
    },
  },
};
