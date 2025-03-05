"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserPopover from "./UserPopover";
import AuthComponent from "./AuthComponent";
import BookingStatusComponent from "./BookingStatusComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { resetUser } from "@/lib/features/userSlice";
import { Loader2, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Skeleton } from "./ui/skeleton";

export function SideMenu({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.user);
  const userLoading = useSelector((state: RootState) => state.user.loading);

  const LOG_OUT = gql`
    mutation Logout {
      logout
    }
  `;

  const dispatch = useDispatch();
  const [logout, { loading }] = useMutation(LOG_OUT);

  return (
    <Sheet>
      <SheetTrigger className="md:hidden" asChild>
        {children}
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col items-start gap-8 px-6 py-5 w-full !max-w-[320px] border-none bg-navy-900/95 backdrop-blur-xl !text-white"
      >
        <SheetHeader className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col">
            <SheetTitle className="text-2xl text-white text-left font-bold tracking-tight">
              SkySwift
            </SheetTitle>
            <SheetDescription className="text-sky-300 text-xs font-light">
              Book flights, effortlessly.
            </SheetDescription>
          </div>
          <SheetClose className="outline-none opacity-60 hover:opacity-100 transition-opacity">
            <X size={20} color="white" />
          </SheetClose>
        </SheetHeader>

        <nav className="flex-1 flex flex-col gap-1 w-full">
          <BookingStatusComponent wrapperType="dialog">
            <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              Check Booking Status
            </button>
          </BookingStatusComponent>
          {user && (
            <>
              <Link
                href="/my-bookings"
                className="px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                My Bookings
              </Link>
              <button
                onClick={async () => {
                  const { data } = await logout();
                  if (data.logout) {
                    dispatch(resetUser());
                  }
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                {loading ? "Signing out…" : "Sign Out"}
                {loading && <Loader2 size={14} className="animate-spin" />}
              </button>
            </>
          )}
        </nav>

        <SheetFooter className="w-full">
          {userLoading ? (
            <Skeleton className="h-8 w-28 bg-white/20" />
          ) : user ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-sky-500 text-white text-sm font-semibold">
                {user.firstName[0].toUpperCase()}
              </div>
              <span className="text-sm text-white font-medium">
                {user.firstName} {user.lastName}
              </span>
            </div>
          ) : (
            <AuthComponent wrapperType="dialog">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 text-white text-sm font-medium w-full justify-center hover:bg-sky-600 transition-colors">
                <LogIn size={16} />
                Sign In
              </button>
            </AuthComponent>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const HeaderContent = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const userLoading = useSelector((state: RootState) => state.user.loading);

  return (
    <div className="flex justify-between items-center w-full max-w-[1240px] 2xl:max-w-[1560px] px-4 md:px-6">
      <Link
        href="/"
        className="header-element opacity-0 font-bold text-xl md:text-2xl tracking-tight"
      >
        SkySwift
      </Link>

      <div className="flex items-center gap-6">
        {/* Desktop nav */}
        <div className="max-md:hidden flex items-center gap-6">
          <BookingStatusComponent>
            <button className="header-element opacity-0 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
              Booking Status
            </button>
          </BookingStatusComponent>

          <div className="header-element opacity-0">
            {userLoading ? (
              <Skeleton className="h-8 w-24 bg-white/20" />
            ) : user ? (
              <UserPopover>
                <button className="flex items-center gap-2.5 cursor-pointer select-none hover:opacity-80 transition-opacity">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-sky-500/80 text-white text-sm font-semibold">
                    {user.firstName[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium" data-test="user-username">
                    {user.firstName} {user.lastName}
                  </span>
                </button>
              </UserPopover>
            ) : (
              <AuthComponent>
                <button className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity" data-test="login-popover-trigger">
                  Sign In
                  <LogIn size={15} />
                </button>
              </AuthComponent>
            )}
          </div>
        </div>

        {/* Mobile menu trigger */}
        <SideMenu>
          <button className="header-element opacity-0 md:hidden h-9 w-9 rounded-lg flex items-center justify-center bg-white/15 backdrop-blur-lg hover:bg-white/25 transition-colors">
            <Menu size={18} color="white" />
          </button>
        </SideMenu>
      </div>
    </div>
  );
};

const Header = ({
  type = "background",
}: {
  type?: "transparent" | "background";
}) => {
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(".header", {
      transform: "translateY(0%)",
      duration: 1.4,
      ease: "power4.out",
    });
    tl.to(
      ".header-element",
      {
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      },
      0.6
    );
  });

  if (type === "background") {
    return (
      <div className="header -translate-y-full h-14 md:h-16 w-full flex justify-center items-center text-white bg-navy-900">
        <HeaderContent />
      </div>
    );
  }

  return (
    <header className="header -translate-y-full h-14 md:h-16 w-full flex justify-center items-center bg-gradient-to-b from-black/40 to-transparent backdrop-blur-[2px] text-white absolute top-0 left-0 z-20">
      <HeaderContent />
    </header>
  );
};

export default Header;
