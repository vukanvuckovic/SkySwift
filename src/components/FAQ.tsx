import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/constants/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Questions = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      {faqData.map((item, index) => (
        <AccordionItem
          key={index}
          className="faq-element"
          value={item.id}
        >
          <AccordionTrigger className="text-base md:text-xl">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="max-md:text-xs text-base text-gray-600">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const FAQ = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl5 = gsap.timeline({
      scrollTrigger: {
        trigger: ".faq-trigger",
        start: "top 80%",
        end: "bottom top",
      },
    });

    tl5.from(".faq-trigger", {
      scale: 1.05,
      duration: 2,
      ease: "power4.out",
    });

    tl5.from(
      ".faq-element",
      {
        transform: "translateX(100%)",
        opacity: 0,
        filter: "blur(10px)",
        duration: 2,
        stagger: 0.1,
        ease: "power4.out",
      },
      0
    );

    tl5.from(
      ".faq-text",
      {
        transform: "translateX(-100%)",
        opacity: 0,
        filter: "blur(10px)",
        duration: 2,
        ease: "power4.out",
      },
      0
    );
  });
  return (
    <div className="faq-trigger flex flex-col max-md:items-center max-md:px-4 md:flex-row gap-8">
      <h2 className="faq-text text-xl md:text-3xl lg:text-5xl">
        Frequently asked questions
      </h2>
      <Questions />
    </div>
  );
};

export default FAQ;
