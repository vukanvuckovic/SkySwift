import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Facebook, Instagram, Youtube } from "iconsax-react";
import { Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import React from "react";

const LandingFooter = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl6 = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer-trigger",
        start: "top 90%",
        end: "bottom top",
      },
    });

    tl6.from(
      ".footer-translate-element",
      {
        transform: "translateY(50px)",
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: "power4.out",
        stagger: 0.05,
      },
      0
    );

    tl6.from(
      ".footer-slide-element",
      {
        transform: "translateX(70px)",
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: "power4.out",
        stagger: 0.2,
      },
      0.5
    );

    tl6.from(
      ".footer-iphone-element",
      {
        transform: "translateY(100%)",
        opacity: 0,
        filter: "blur(10px)",
        duration: 2,
        ease: "power4.out",
      },
      1
    );

    tl6.from(
      ".footer-opacity-element",
      {
        opacity: 0,
        filter: "blur(10px)",
        duration: 2,
        ease: "power4.out",
        stagger: 0.2,
      },
      1
    );

    tl6.from(
      ".bottom-bar-left",
      {
        opacity: 0,
        duration: 2,
        transform: "translateX(-100px)",
        ease: "power4.out",
        stagger: 0.2,
      },
      2
    );

    tl6.from(
      ".bottom-bar-right",
      {
        opacity: 0,
        duration: 2,
        transform: "translateX(100px)",
        ease: "power4.out",
        stagger: 0.4,
      },
      2
    );
  });

  return (
    <div className="footer-trigger flex flex-col bg-[linear-gradient(to_right,#002554,#002a5d)] text-white">
      <div className="flex flex-col w-full max-w-[1140px] 2xl:max-w-[1440px] mx-auto px-4">
        <div className="flex flex-col md:flex-row md:gap-10">
          <div className="flex flex-col gap-10 py-10">
            <h2 className="footer-translate-element max-md:text-2xl text-4xl md:text-5xl">
              SkySwift
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3 self-start">
                <h3 className="footer-translate-element font-semibold text-green-400 max-md:text-sm">
                  Corporate
                </h3>
                <ul className="flex flex-col gap-2 font-bold text-xs max-md:text-[10px]">
                  <li className="footer-translate-element">About Us</li>
                  <li className="footer-translate-element">Mission & Vision</li>
                  <li className="footer-translate-element">Our Policies</li>
                  <li className="footer-translate-element">Tender Notices</li>
                  <li className="footer-translate-element">
                    Flight Destinations
                  </li>
                  <li className="footer-translate-element">
                    Frequently Asked Questions
                  </li>
                  <li className="footer-translate-element">
                    Rules and Conditions
                  </li>
                  <li className="footer-translate-element">Career</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 self-start">
                <h3 className="footer-translate-element font-semibold text-green-400 max-md:text-sm">
                  Media
                </h3>
                <ul className="flex flex-col gap-2 font-bold text-xs max-md:text-[10px]">
                  <li className="footer-translate-element">
                    Press and Announcements
                  </li>
                  <li className="footer-translate-element">Gallery</li>
                </ul>
                <h3 className="footer-translate-element font-semibold text-green-400 max-md:text-sm">
                  Contact
                </h3>
                <ul className="flex flex-col gap-2 font-bold text-xs max-md:text-[10px]">
                  <li className="footer-translate-element">Baggage Tracking</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-12 pt-10">
            <div className="flex flex-row flex-wrap items-center gap-4 justify-between">
              <h2 className="footer-slide-element max-md:text-xl text-3xl">
                Follow Us on Social Media
              </h2>
              <div className="flex items-center gap-6">
                <Youtube
                  size={30}
                  color="white"
                  variant="Bold"
                  className="footer-slide-element"
                />
                <Facebook
                  size={30}
                  color="white"
                  variant="Bold"
                  className="footer-slide-element"
                />
                <Linkedin
                  size={30}
                  color="white"
                  className="footer-slide-element"
                />
                <Instagram
                  size={30}
                  color="white"
                  variant="Bold"
                  className="footer-slide-element"
                />
                <Twitter
                  size={30}
                  color="white"
                  className="footer-slide-element"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col max-md:items-center md:flex-row gap-6 overflow-hidden">
              <div className="footer-iphone-element md:flex-1 max-md:w-full max-md:max-w-[300px] max-w-[250px] h-[300px] relative">
                <Image
                  src={"/mockup/iphone.png"}
                  alt="iphone"
                  fill
                  className="md:object-cover object-contain object-top"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center max-md:items-center gap-4 py-4">
                <h2 className="footer-opacity-element text-xl md:text-3xl font-bold leading-none">
                  SkySwift Mobile
                </h2>
                <span className="footer-opacity-element max-md:text-xs text-sm text-white font-light max-md:text-center leading-none">
                  Download SkySwift mobile app and get instant notifications
                  about new opportunities.
                </span>
                <div className="flex flex-row flex-wrap gap-1 mt-2">
                  <Image
                    src={"/download/appstore.svg"}
                    alt="appstore"
                    height={50}
                    width={100}
                    className="footer-opacity-element"
                  />
                  <Image
                    src={"/download/googleplay.svg"}
                    alt="appstore"
                    height={50}
                    width={100}
                    className="footer-opacity-element"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex max-md:flex-col items-start md:items-center justify-between gap-6 border-t-[1px] border-blue-800 py-4 font-medium">
          <span className="bottom-bar-left max-md:text-[10px] text-sm max-md:order-2">
            SkySwift {new Date().getFullYear()} © All rights of this site are
            reserved.
          </span>
          <div className="flex max-md:flex-col max-md:items-start items-center gap-2 md:gap-6 max-md:text-xs text-sm max-md:order-1">
            <span className="bottom-bar-right">Feedback Form</span>
            <span className="bottom-bar-right">Stay Informed About Us</span>
            <span className="bottom-bar-right">Privacy Statement</span>
            <span className="bottom-bar-right">Cookie Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
