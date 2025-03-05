import { airports } from "@/constants/airports";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe } from "lucide-react";
import React from "react";

const FlightDestinations = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".destinations-trigger",
        start: "top 88%",
        end: "bottom top",
      },
    });

    tl.from(".destinations-header", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      immediateRender: false,
    }, 0);

    tl.from(".destination-city", {
      y: 16,
      opacity: 0,
      filter: "blur(4px)",
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.015,
      immediateRender: false,
    }, 0.1);
  });

  return (
    <div className="destinations-trigger flex flex-col gap-5">
      <div className="destinations-header flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
          <Globe size={16} className="text-sky-600" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">
            All Flight Destinations
          </h2>
          <p className="text-xs text-slate-400">{airports.length} destinations worldwide</p>
        </div>
      </div>

      <div className="px-5 py-6 rounded-xl border border-slate-100 bg-slate-50/60 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {airports.map((item, index) => (
          <div
            key={index}
            className="destination-city flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150 cursor-default group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 group-hover:bg-sky-500 transition-colors" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-slate-700 truncate group-hover:text-slate-900">
                {item.city}
              </span>
              <span className="text-xs text-slate-400">{item.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightDestinations;
