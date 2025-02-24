"use client";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { RootState } from "@/lib/store";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Loader = () => {
  const { loading } = useSelector((state: RootState) => state.loader);
  const dispatch = useDispatch();

  useGSAP(() => {
    const tl = gsap.timeline();

    if (loading) {
      tl.set(".loader", { visibility: "visible" }); // Make it visible first
      tl.fromTo(
        ".loader",
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      tl.from(
        ".loader-text",
        {
          opacity: 0,
          transform: "translateY(50px)",
          duration: 1,
          ease: "power4.out",
        },
        0.2
      );
      tl.from(
        ".loading-icon",
        {
          opacity: 0,
          transform: "translateY(50px)",
          duration: 1,
          ease: "power4.out",
        },
        0.4
      );
      tl.from(
        ".loading-icon",
        {
          rotate: 360,
          ease: "none",
          duration: 1,
          repeat: -1,
        },
        0.4
      );
    } else {
      tl.to(".loader", {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      }).set(".loader", { visibility: "hidden" }); // Hide it after animation
    }
  }, [loading]);

  return (
    <div
      onClick={() => dispatch(setLoadingState(false))}
      className="loader h-[100dvh] w-[100dvw] invisible flex justify-center items-center gap-3 bg-black/20 backdrop-blur-xl fixed top-0 left-0 z-[100]"
    >
      <div className="flex items-center gap-3">
        <h1 className="loader-text font-bold max-md:text-3xl text-5xl text-white leading-none">SkySwift</h1>
        <Loader2
          size={36}
          color="white"
          className="loading-icon "
        />
      </div>
    </div>
  );
};

export default Loader;
