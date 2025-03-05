import type { Metadata } from "next";
import "@/app/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

export const metadata: Metadata = {
  title: "Booking — SkySwift",
  description: "Book your flight with SkySwift.",
};

export default function BookingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50">
      <Loader />
      <Header />
      <main className="flex-1 w-full max-w-[1140px] 2xl:max-w-[1440px] self-center px-3 md:px-5">
        {children}
      </main>
      <Footer />
    </div>
  );
}
