import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bell, Download, Smartphone } from "lucide-react";
import Image from "next/image";
import React from "react";

const MobileApp = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".application-trigger",
        start: "top 88%",
        end: "bottom top",
      },
    });

    tl.from(".application-trigger", {
      scale: 1.02,
      duration: 1.2,
      ease: "power4.out",
      immediateRender: false,
    }, 0);

    tl.from(".application-element", {
      y: 40,
      opacity: 0,
      filter: "blur(8px)",
      duration: 1,
      ease: "power3.out",
      stagger: 0.15,
      immediateRender: false,
    }, 0);
  });

  return (
    <div className="application-trigger relative flex flex-col md:flex-row items-center justify-between px-8 md:px-16 gap-10 md:gap-8 min-h-[320px] bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 rounded-2xl overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-navy-950/60 rounded-full translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.08)_0%,_transparent_60%)] pointer-events-none" />

      {/* Text content */}
      <div className="relative z-10 flex flex-col gap-5 py-10 md:py-10 max-md:items-center max-w-sm">
        <div className="application-element inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 w-fit">
          <Smartphone size={12} className="text-sky-300" />
          <span className="text-xs text-sky-200 font-medium tracking-wide">Mobile App</span>
        </div>

        <div className="application-element flex flex-col gap-2 max-md:items-center max-md:text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none">
            SkySwift<br />
            <span className="text-sky-400">Mobile</span>
          </h2>
          <p className="text-slate-400 text-sm font-light max-w-[260px] leading-relaxed">
            Book flights, manage your trips, and check in — all from your pocket.
          </p>
        </div>

        <div className="application-element flex flex-col gap-2">
          {[
            { icon: Bell, label: "Real-time flight notifications" },
            { icon: Download, label: "Offline boarding passes" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-sky-200/80">
              <Icon size={12} className="text-sky-400 flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>

        <div className="application-element flex gap-2.5 flex-wrap">
          <Image
            src="/download/appstore.svg"
            alt="Download on the App Store"
            height={40}
            width={128}
            className="rounded-xl opacity-90 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/download/googleplay.svg"
            alt="Get it on Google Play"
            height={40}
            width={128}
            className="rounded-xl opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>

      {/* Phone mockup */}
      <div className="relative z-10 application-element flex-shrink-0 self-end h-[260px] md:h-[320px] w-[180px] md:w-[220px]">
        <Image
          src="/mockup/iphone.png"
          alt="SkySwift mobile app"
          fill
          className="object-contain object-bottom drop-shadow-[0_-8px_24px_rgba(37,99,235,0.25)]"
        />
      </div>
    </div>
  );
};

export default MobileApp;
