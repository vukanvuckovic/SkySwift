import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import React from "react";

const MobileApp = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl4 = gsap.timeline({
      scrollTrigger: {
        trigger: ".application-trigger",
        start: "top 90%",
        end: "bottom top",
      },
    });

    tl4.from(".application-trigger", {
      scale: 1.05,
      duration: 2,
      ease: "power4.out",
    });

    tl4.from(
      ".application-element",
      {
        transform: "translateY(100%)",
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.5,
        ease: "power4.out",
        stagger: 0.2,
      },
      0
    );
  });
  return (
    <div className="application-trigger flex flex-col md:flex-row items-center justify-center px-6 gap-10 max-md:py-10 md:gap-20 min-h-[300px] bg-[linear-gradient(#008cff,#269dff)] rounded-xl overflow-hidden">
      <span className="application-element text-white max-md:text-3xl text-5xl font-semibold">
        SkySwift
      </span>
      <div className="application-element h-[250px] w-[220px] rounded-t-xl md:self-end relative">
        <Image
          src={"/mockup/iphone.png"}
          alt="iphone"
          fill
          className="max-md:object-contain object-cover object-top"
        />
      </div>
      <div className="flex flex-col max-md:items-center gap-4">
        <span className="application-element max-w-[300px] text-white font-light max-md:text-center">
          Download SkySwift mobile app and get instant notifications about new
          opportunities.
        </span>
        <div className="flex flex-row flex-wrap gap-1">
          <Image
            src={"/download/appstore.svg"}
            alt="appstore"
            height={50}
            width={100}
            className="application-element object-cover"
          />
          <Image
            src={"/download/googleplay.svg"}
            alt="appstore"
            height={50}
            width={100}
            className="application-element object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
