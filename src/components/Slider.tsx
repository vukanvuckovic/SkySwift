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
      stagger: 0.3,
      duration: 2,
      ease: "power4.out",
    });
    gsap.to(".heading-desc", {
      opacity: 1,
      filter: "blur(0px)",
      transform: "translateY(0px)",
      duration: 2,
      ease: "power4.out",
      delay: 1,
    });
  }, []);

  return (
    <div className="flex-1 flex flex-row justify-center items-center relative">
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-[9]" />
      <div className="w-full h-full flex flex-row overflow-hidden absolute top-0 left-0">
        <div
          style={{
            transform: `translateX(calc(-${sliderIndex}*100%))`,
            transition: "1s",
          }}
          className="w-[100dvw] h-full flex flex-row ease-out"
        >
          {sliderImages.map((item) => (
            <div
              key={item}
              className="w-full h-full flex-shrink-0 relative"
            >
              <Image
                src={item}
                alt="img"
                fill
                className="object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col max-md:items-center gap-1 z-10 text-white custom-drop-shadow">
        <h1 className="text-3xl md:text-7xl font-bold max-md:text-center">
          <span className="heading-element opacity-0 blur-md">Book </span>
          <span className="heading-element opacity-0 blur-md">a flight </span>
          <span className="heading-element opacity-0 blur-md">
            effortlessly.
          </span>
        </h1>
        <span className="heading-desc opacity-0 blur-md translate-y-[50px] text-xs md:text-lg">
          Take a look at our wide selection of flights.
        </span>
      </div>
    </div>
  );
};

export default Slider;
