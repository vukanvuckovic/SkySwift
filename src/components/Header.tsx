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
import { Loader2, LogIn } from "lucide-react";
import { ArrowLeft2, HambergerMenu } from "iconsax-react";
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
  const [logout, { loading, error }] = useMutation(LOG_OUT);

  return (
    <Sheet>
      <SheetTrigger
        className="md:hidden"
        asChild
      >
        {children}
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="flex flex-col items-start gap-8 px-6 py-5 w-full !max-w-[350px] border-none bg-white/20 backdrop-blur-xl !text-white"
      >
        <SheetHeader className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col">
            <SheetTitle className="max-md:text-xl text-3xl text-white text-left">
              SkySwift
            </SheetTitle>
            <SheetDescription className="text-gray-300 text-xs">
              Book a flight seamlessly.
            </SheetDescription>
          </div>

          <SheetClose className="outline-none">
            <ArrowLeft2
              size={24}
              color="white"
            />
          </SheetClose>
        </SheetHeader>
        <ul className="flex-1 flex flex-col gap-3 ml-0 text-gray-200 text-sm">
          <li>
            <BookingStatusComponent wrapperType="dialog">
              <button>Booking Status</button>
            </BookingStatusComponent>
          </li>
          {user && (
            <>
              <li>
                <Link href={"/my-bookings"}>My Bookings</Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    const { data } = await logout();
                    if (data.logout) {
                      dispatch(resetUser());
                    } else {
                      console.log(error);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  {loading ? "Logging Out" : "Log Out"}
                  {loading && (
                    <Loader2
                      size={16}
                      color="white"
                    />
                  )}
                </button>
              </li>
            </>
          )}
        </ul>
        <SheetFooter>
          {userLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : user ? (
            <div className="flex flex-row items-center gap-2 max-md:text-sm cursor-pointer select-none">
              <div className="header-element max-md:h-8 h-9 aspect-square rounded-full flex justify-center items-center bg-white/30 backdrop-blur-2xl">
                {user.firstName[0].toUpperCase()}
              </div>
              <span className="header-element">
                {user.firstName + " " + user.lastName}
              </span>
            </div>
          ) : (
            <AuthComponent wrapperType="dialog">
              <div className="header-element flex flex-row items-center gap-2 cursor-pointer">
                <LogIn
                  size={18}
                  color="white"
                />
                Log In
              </div>
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
    <div className="flex justify-between items-center w-full max-w-[1240px] 2xl:max-w-[1560px] px-4 custom-drop-shadow">
      <Link
        href={"/"}
        className="header-element opacity-0 font-semibold text-lg md:text-2xl"
      >
        SkySwift
      </Link>
      <div className="flex flex-row items-center gap-10">
        <div className="max-md:hidden flex flex-row items-center gap-10">
          <BookingStatusComponent>
            <span className="header-element opacity-0 cursor-pointer">
              Booking Status
            </span>
          </BookingStatusComponent>
          <div className="header-element opacity-0">
            {userLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : user ? (
              <UserPopover>
                <div className="flex flex-row items-center gap-2 cursor-pointer select-none">
                  <div className="h-9 aspect-square rounded-full flex justify-center items-center bg-white/30 backdrop-blur-2xl">
                    {user.firstName[0].toUpperCase()}
                  </div>
                  <span data-test="user-username">
                    {user.firstName + " " + user.lastName}
                  </span>
                </div>
              </UserPopover>
            ) : (
              <AuthComponent>
                <div className="flex flex-row items-center gap-2 cursor-pointer">
                  Log In
                  <LogIn
                    size={18}
                    color="white"
                  />
                </div>
              </AuthComponent>
            )}
          </div>
        </div>
        <SideMenu>
          <div className="header-element opacity-0 h-7 md:h-10 aspect-square rounded-lg flex justify-center items-center bg-white/20 backdrop-blur-lg">
            <HambergerMenu
              size={16}
              color="white"
            />
          </div>
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
      duration: 2,
      ease: "power4.out",
    });
    tl.to(
      ".header-element",
      {
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
      },
      1
    );
  });

  return type === "background" ? (
    <div className="header -translate-y-full h-12 md:h-16 w-full flex justify-center text-white bg-blue-500">
      <HeaderContent />
    </div>
  ) : (
    <header className="header -translate-y-full h-12 md:h-16 w-full flex justify-center bg-white/20 backdrop-blur-2xl text-white absolute top-0 left-0 z-20">
      <HeaderContent />
    </header>
  );
};

export default Header;
