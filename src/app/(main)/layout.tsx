"use client";
import "@/app/globals.css";
import { useEffect } from "react";
import { setLoading, setUser } from "@/lib/features/userSlice";
import { useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useDispatch();

  const ME = gql`
    query Me {
      me {
        id
        firstName
        lastName
        email
      }
    }
  `;

  const { data, loading, error } = useQuery(ME);

  console.log("auth component", data, loading, error);

  useEffect(() => {
    if (!loading) {
      dispatch(setLoading(false));
      if (data.me) {
        const userData = {
          id: data.me.id,
          email: data.me.email,
          firstName: data.me.firstName,
          lastName: data.me.lastName,
        };
        console.log("auth me", userData);
        dispatch(setUser(userData));
      }
    }
  }, [data, loading]);

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3000/api/auth/me`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         // console.error("Error fetching user:", response.statusText);
  //         return;
  //       }

  //       const data = await response.json();

  //       if (data.user) {
  //         const userData = {
  //           id: data.user._id,
  //           email: data.user.email,
  //           firstName: data.user.firstName,
  //           lastName: data.user.lastName,
  //           // bookings: data.user.bookings,
  //         };

  //         dispatch(setUser(userData));
  //       }
  //     } catch (error: any) {
  //       if (error.name === "AbortError") {
  //         console.log("Fetch aborted");
  //       } else {
  //         console.error("Failed to fetch user:", error);
  //       }
  //     }
  //   };

  //   getUser();
  // }, []);

  return (
    <div>
      {children}
      <Toaster
        theme="light"
        richColors
        position="top-center"
      />
    </div>
  );
}
