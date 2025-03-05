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
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".faq-trigger",
        start: "top 82%",
        end: "bottom top",
      },
    });

    tl.from(".faq-text", {
      x: -40,
      opacity: 0,
      filter: "blur(6px)",
      duration: 1,
      ease: "power3.out",
      immediateRender: false,
    }, 0);

    tl.from(".faq-element", {
      x: 40,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.8,
      stagger: 0.06,
      ease: "power3.out",
      immediateRender: false,
    }, 0.1);
  });

  return (
    <div className="faq-trigger flex flex-col md:flex-row gap-8 md:gap-12">
      {/* Left heading */}
      <div className="faq-text flex flex-col gap-3 md:min-w-[300px] md:max-w-[340px] lg:min-w-[360px] lg:max-w-[400px] flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
          <HelpCircle size={20} className="text-sky-600" />
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-800 leading-tight">
          Frequently asked questions
        </h2>
        <p className="text-sm text-slate-400 font-light">
          Everything you need to know before you fly.
        </p>
      </div>

      {/* Accordion */}
      <div className="flex-1">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              className="faq-element border-b border-slate-100 last:border-0"
              value={item.id}
            >
              <AccordionTrigger className="text-sm md:text-base font-medium text-slate-800 hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500 leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
