import { airports } from "@/constants/airports";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React from "react";

const FlightDestinations = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: ".destinations-trigger",
        start: "top 90%",
        end: "bottom top",
      },
    });

    tl3.from(".destination-city", {
      transform: "translateY(100%)",
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.02,
    });

    tl3.from(".destinations-trigger", {
      borderColor: "transparent",
      borderRadius: 0,
      duration: 0.5,
    });
  });
  return (
    <div className="flex flex-col max-md:gap-3 gap-6 bg-white">
      <h2 className="max-md:text-xl max-md:ml-2 text-3xl">All Flight Destinations</h2>
      <div className="destinations-trigger px-8 py-6 rounded-lg border-[1px] border-gray-200 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {airports.map((item, index) => (
          <div
            key={index}
            className="destination-city flex flex-row items-center gap-2"
          >
            <div className="h-1 w-1 rounded-full bg-green-400" />
            <span className="text-sm text-gray-600">{item.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightDestinations;
