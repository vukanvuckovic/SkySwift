import { sliderImages } from "@/constants/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Slider = () => {
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev < sliderImages.length - 1 ? prev + 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    gsap.to(".heading-element", {
      opacity: 1,
      filter: "blur(0px)",
      stagger: 0.25,
      duration: 1.8,
      ease: "power4.out",
      delay: 0.4,
    });
    gsap.to(".heading-desc", {
      opacity: 1,
      filter: "blur(0px)",
      transform: "translateY(0px)",
      duration: 1.6,
      ease: "power4.out",
      delay: 1.2,
    });
    gsap.to(".slider-badge", {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: 1.6,
    });
  }, []);

  return (
    <div className="flex-1 flex flex-row justify-center items-center relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-900/30 to-navy-950/70 z-[9]" />

      {/* Slider images */}
      <div className="w-full h-full flex flex-row overflow-hidden absolute inset-0">
        <div
          style={{
            transform: `translateX(calc(-${sliderIndex} * 100%))`,
            transition: "1.2s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
          className="w-[100dvw] h-full flex flex-row"
        >
          {sliderImages.map((item) => (
            <div key={item} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={item}
                alt="Destination"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-4 z-10 text-white text-center px-4 custom-drop-shadow">
        <div className="slider-badge opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-medium tracking-widest uppercase text-sky-200 mb-2">
          ✈ Book with confidence
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-none tracking-tight">
          <span className="heading-element opacity-0 blur-md block">Fly </span>
          <span className="heading-element opacity-0 blur-md block">
            anywhere,
          </span>
          <span className="heading-element opacity-0 blur-md block text-sky-300">
            effortlessly.
          </span>
        </h1>
        <p className="heading-desc opacity-0 blur-md translate-y-8 text-sm md:text-lg text-slate-200 font-light max-w-md">
          Search hundreds of routes and find your perfect flight in seconds.
        </p>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {sliderImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setSliderIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === sliderIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
