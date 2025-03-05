"use client";
import { resetBooking } from "@/lib/features/bookingSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import SearchComponent from "@/components/SearchComponent";
import LandingFooter from "@/components/LandingFooter";
import { resetSearch } from "@/lib/features/searchSlice";
import AdditionalServices from "@/components/sections/AdditionalServices";
import FlightDestinations from "@/components/sections/FlightDestinations";
import MobileApp from "@/components/sections/MobileApp";
import FAQ from "@/components/FAQ";
import Hero from "@/components/sections/Hero";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetBooking());
    dispatch(resetSearch());
    localStorage.removeItem("searchState");
    localStorage.removeItem("bookingState");
  }, []);

  return (
    <div className="flex flex-col [overflow-x:clip]">
      <Hero />
      <div className="flex flex-col gap-20 w-full max-w-[1240px] 2xl:max-w-[1440px] max-md:px-2 px-4 self-center -mt-20 z-20 pb-20">
        <SearchComponent />
        <AdditionalServices />
        <FlightDestinations />
        <MobileApp />
        <FAQ />
      </div>
      <LandingFooter />
    </div>
  );
};

export default Home;
