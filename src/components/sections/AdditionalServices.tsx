import React from "react";
import { BedDouble, Box, Luggage, Pizza, PlaneTakeoff } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const AdditionalServices = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".additional-services-trigger",
        start: "top 90%",
        end: "bottom top",
      },
    });

    tl2.from(
      ".additional-services-text-element",
      {
        transform: "translateY(100%)",
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: "power3.out",
        stagger: 0.3,
      },
      0
    );

    tl2.from(
      ".additional-service-card",
      {
        transform: "translateX(200px)",
        opacity: 0,
        filter: "blur(10px)",
        duration: 2,
        ease: "power4.out",
        stagger: 0.2,
      },
      0.3
    );
  });
  return (
    <div className="additional-services-trigger flex flex-col justify-center items-center max-md:p-3 p-6 max-md:gap-6 gap-10 min-h-[400px] rounded-xl overflow-hidden bg-[url('/airplane3.jpg')] bg-cover bg-center relative">
      <div className="backdrop-blur-sm absolute top-0 left-0 h-full w-full bg-black/20" />
      <div className="flex flex-col self-start leading-none ml-2 z-10 custom-drop-shadow">
        <h2 className="additional-services-text-element max-md:text-xl text-3xl text-white">
          Additional Services
        </h2>
        <span className="additional-services-text-element max-md:text-xs text-gray-200">
          Fly with pleasure. Find more information below.
        </span>
      </div>
      <div className="w-full flex flex-row flex-wrap items-center max-md:gap-2 gap-4 z-10">
        <div className="additional-service-card">
          <PlaneTakeoff
            size={32}
            color="#3b82f6"
          />
          <span className="text-white truncate">Seat Selection</span>
        </div>
        <div className="additional-service-card">
          <Pizza
            size={32}
            color="#3b82f6"
          />
          <span className="text-white truncate">Meal Selection</span>
        </div>
        <div className="additional-service-card">
          <Luggage
            size={32}
            color="#3b82f6"
          />
          <span className="text-white truncate">Excess Luggage</span>
        </div>
        <div className="additional-service-card">
          <Box
            size={32}
            color="#3b82f6"
          />
          <span className="text-white truncate">Sports Equipment</span>
        </div>
        <div className="additional-service-card">
          <BedDouble
            size={32}
            color="#3b82f6"
          />
          <span className="text-white truncate">CIP Lounge</span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalServices;
