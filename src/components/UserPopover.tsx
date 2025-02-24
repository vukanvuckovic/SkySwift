import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Logout, Ticket2 } from "iconsax-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { resetUser } from "@/lib/features/userSlice";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

const UserPopover = ({ children }: { children: React.ReactNode }) => {
  const LOG_OUT = gql`
    mutation Logout {
      logout
    }
  `;

  const dispatch = useDispatch();
  const [logout, { loading, error }] = useMutation(LOG_OUT);

  return (
    <Popover>
      <PopoverTrigger
        data-test="user-popover-trigger"
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full p-1 rounded-[8px] bg-white/50 backdrop-blur-2xl border-white/30 text-gray-700">
        <ul className="flex flex-col gap-1">
          <li>
            <button
              data-test="popover-logout-button"
              onClick={async () => {
                const { data } = await logout();
                if (data.logout) {
                  dispatch(resetUser());
                  toast.success("Logged out successfully!");
                } else {
                  toast.error("Error logging out", {
                    description: "Try again later.",
                  });
                  console.log(error);
                }
              }}
              className="w-full flex items-center gap-3 hover:bg-white/10 duration-150 p-2 rounded-[4px] outline-none"
            >
              <Logout
                size={18}
                color="#374151"
              />
              <span className="text-[16px]">
                {loading ? "Logging Out..." : "Log Out"}
              </span>
            </button>
          </li>
          <li>
            <Link
              href={"/my-bookings"}
              className="w-full flex items-center gap-3 hover:bg-white/10 duration-150 p-2 rounded-[4px] outline-none"
            >
              <Ticket2
                size={18}
                color="#374151"
              />
              <span className="text-[16px]">My Bookings</span>
            </Link>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
