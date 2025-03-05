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

  const { data, loading } = useQuery(ME);

  useEffect(() => {
    if (!loading) {
      dispatch(setLoading(false));
      if (data?.me) {
        dispatch(
          setUser({
            id: data.me.id,
            email: data.me.email,
            firstName: data.me.firstName,
            lastName: data.me.lastName,
          })
        );
      }
    }
  }, [data, loading]);

  return (
    <div>
      {children}
      <Toaster theme="light" richColors position="top-center" />
    </div>
  );
}
