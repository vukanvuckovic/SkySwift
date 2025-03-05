import { resetUser } from "@/lib/features/userSlice";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LogoutButtonWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const LOG_OUT = gql`
    mutation Logout {
      logout
    }
  `;

  const [logout] = useMutation(LOG_OUT);
  const dispatch = useDispatch();

  return (
    <button
      onClick={async () => {
        try {
          const { data } = await logout();
          if (data.logout) {
            dispatch(resetUser());
          } else {
            toast.error("Logout failed. Please try again.");
          }
        } catch {
          toast.error("An error occurred during logout.");
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
};

export default LogoutButtonWrapper;
