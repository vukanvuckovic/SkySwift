"use client";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import "@/app/globals.css";
import React from "react";

const CheckBookingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 overflow-x-hidden">
      <Header />
      <div className="flex-1 flex flex-col w-full max-w-[1140px] 2xl:max-w-[1440px] self-center max-md:px-2 px-4">
        {children}
      </div>
      <LandingFooter />
    </div>
  );
};

export default CheckBookingLayout;
