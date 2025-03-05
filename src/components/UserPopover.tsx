import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { LogOut, Ticket } from "lucide-react";
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
  const [logout, { loading }] = useMutation(LOG_OUT);

  return (
    <Popover>
      <PopoverTrigger data-test="user-popover-trigger" asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-44 p-1.5 rounded-xl bg-white shadow-xl border border-slate-100"
      >
        <ul className="flex flex-col gap-0.5">
          <li>
            <Link
              href="/my-bookings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 font-medium transition-colors"
            >
              <Ticket size={15} className="text-slate-400" />
              My Bookings
            </Link>
          </li>
          <li>
            <button
              data-test="popover-logout-button"
              onClick={async () => {
                const { data } = await logout();
                if (data.logout) {
                  dispatch(resetUser());
                  toast.success("Signed out successfully.");
                } else {
                  toast.error("Error signing out", { description: "Try again later." });
                }
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-sm text-slate-600 font-medium transition-colors"
            >
              <LogOut size={15} className="text-slate-400" />
              {loading ? "Signing out…" : "Sign Out"}
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
