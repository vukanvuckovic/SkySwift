import React from "react";
import { BedDouble, Box, Luggage, Pizza, PlaneTakeoff } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SERVICES = [
  { icon: PlaneTakeoff, label: "Seat Selection", desc: "Choose your ideal seat" },
  { icon: Pizza, label: "Meal Selection", desc: "Pre-order your in-flight meal" },
  { icon: Luggage, label: "Excess Luggage", desc: "Extra baggage allowance" },
  { icon: Box, label: "Sports Equipment", desc: "Travel with your gear" },
  { icon: BedDouble, label: "CIP Lounge", desc: "Exclusive airport lounge access" },
];

const AdditionalServices = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".additional-services-trigger",
        start: "top 88%",
        end: "bottom top",
      },
    });

    tl.from(".additional-services-text-element", {
      y: 30,
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
      immediateRender: false,
    }, 0);

    tl.from(".additional-service-card", {
      x: 60,
      opacity: 0,
      filter: "blur(8px)",
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.12,
      immediateRender: false,
    }, 0.2);
  });

  return (
    <div className="additional-services-trigger flex flex-col justify-center items-start gap-8 p-6 md:p-10 min-h-[380px] rounded-2xl overflow-hidden bg-[url('/airplane3.jpg')] bg-cover bg-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950/85 via-navy-900/70 to-navy-900/50" />

      <div className="relative z-10 flex flex-col gap-1">
        <p className="additional-services-text-element text-xs font-semibold text-sky-400 uppercase tracking-widest">
          What we offer
        </p>
        <h2 className="additional-services-text-element text-2xl md:text-3xl text-white font-bold tracking-tight">
          Additional Services
        </h2>
        <p className="additional-services-text-element text-sm text-slate-300 font-light">
          Enhance your journey with our premium add-ons.
        </p>
      </div>

      <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SERVICES.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="additional-service-card flex flex-col gap-3 p-4 md:p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 hover:bg-white/18 hover:border-white/25 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <Icon size={20} className="text-sky-300" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white text-sm font-semibold leading-tight">{label}</span>
              <span className="text-slate-400 text-xs leading-snug">{desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalServices;
