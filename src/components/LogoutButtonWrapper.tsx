import { resetUser } from "@/lib/features/userSlice";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useDispatch } from "react-redux";

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

  const [logout, { error }] = useMutation(LOG_OUT);
  const dispatch = useDispatch();

  return (
    <button
      onClick={async () => {
        const { data } = await logout();
        if (data.logout) {
          dispatch(resetUser());
        } else {
          console.log(error);
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
};

export default LogoutButtonWrapper;
