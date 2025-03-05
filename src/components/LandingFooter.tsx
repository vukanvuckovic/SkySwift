"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import React from "react";
import { Twitter, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Company: ["About Us", "Mission & Vision", "Our Policies", "Careers", "Flight Destinations"],
  Support: ["FAQ", "Baggage Tracking", "Press & Announcements", "Contact Us"],
  Legal: ["Privacy Statement", "Cookie Policy", "Terms & Conditions"],
};

const LandingFooter = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer-trigger",
        start: "top 90%",
        end: "bottom top",
      },
    });

    tl.from(".footer-translate-element", {
      y: 30,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.04,
    }, 0);

    tl.from(".footer-slide-element", {
      x: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
    }, 0.3);

    tl.from(".footer-iphone-element", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    }, 0.4);
  });

  return (
    <footer className="footer-trigger bg-navy-950 text-white">
      <div className="w-full max-w-[1140px] 2xl:max-w-[1440px] mx-auto px-5 md:px-8">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-white/10">

          {/* Brand column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="footer-translate-element text-2xl font-bold tracking-tight">
                SkySwift
              </span>
              <p className="footer-translate-element text-sm text-slate-400 font-light max-w-[240px] leading-relaxed">
                Book flights seamlessly. Search hundreds of routes and find your perfect journey.
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {[Youtube, Facebook, Instagram].map((Icon, i) => (
                <button
                  key={i}
                  className="footer-translate-element w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon size={16} color="white" />
                </button>
              ))}
              <button className="footer-translate-element w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin size={16} color="white" />
              </button>
              <button className="footer-translate-element w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter size={16} color="white" />
              </button>
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-3">
                <h4 className="footer-translate-element text-xs font-semibold text-sky-400 uppercase tracking-widest">
                  {category}
                </h4>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link}>
                      <span className="footer-translate-element text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* App download */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="footer-slide-element text-xs font-semibold text-sky-400 uppercase tracking-widest">
              Get the App
            </h4>
            <p className="footer-slide-element text-sm text-slate-400 leading-relaxed">
              Manage bookings on the go with SkySwift Mobile.
            </p>
            <div className="flex flex-col gap-2">
              <Image
                src="/download/appstore.svg"
                alt="App Store"
                height={40}
                width={130}
                className="footer-slide-element rounded-lg"
              />
              <Image
                src="/download/googleplay.svg"
                alt="Google Play"
                height={40}
                width={130}
                className="footer-slide-element rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-5 text-xs text-slate-500">
          <span>SkySwift © {new Date().getFullYear()} — All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Cookies</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Feedback</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
