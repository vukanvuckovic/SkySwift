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

        if (!token) {
          console.log("No session");
          return;
        }

        let decoded: any = undefined;

        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error) {
          console.log(error);
          return;
        }

        if (!decoded) {
          return;
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
          console.log("No user");
          return;
        }

        console.log("user in me resolver", user);

        return user;
      } catch (error) {
        console.log("Error", error);
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
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        console.log("login started");
        if (!email || !password) {
          console.log("No email or password");
          return;
        }

        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
          console.log("No user");
          return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log("Incorrect password");
          return;
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET as string,
          { expiresIn: "7d" } //7d
        );

        (await cookies()).set("session", token, {
          httpOnly: true,
          //   secure: process.env.NODE_ENV === "production",
          secure: false,
          sameSite: "strict",
          path: "/",
        });

        console.log("login finished, returning user", user);

        return user;
      } catch (error: any) {
        console.log("Error logging in", error.message);
        return;
      }
    },
    register: async (
      _: any,
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
      } catch (error: any) {
        console.error("Error creating user:", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
  },
};
