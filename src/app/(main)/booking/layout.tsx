import type { Metadata } from "next";
import "@/app/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

export const metadata: Metadata = {
  title: "Booking",
  description: "Book a flight.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <Loader />
      <Header />
      <div className="flex-1 w-full max-w-[1140px] 2xl:max-w-[1440px] self-center max-md:px-2 px-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}
