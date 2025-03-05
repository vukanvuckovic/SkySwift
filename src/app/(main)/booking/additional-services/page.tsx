"use client";
import FlightSelector from "@/components/FlightSelector";
import PassengerInfoCard from "@/components/PassengerInfoCard";
import PassengerSelector from "@/components/PassengerSelector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { additionalServices, serviceCardInfo } from "@/constants/data";
import { SelectionContext } from "@/context/selectionContext";
import {
  addLuggage,
  addMeal,
  BookingFlight,
  Flight,
  Passenger,
  updateBooking,
} from "@/lib/features/bookingSlice";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { getBookingState } from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const OptionsPopover = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "meals" | "luggage";
}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const selectionInfo = useContext(SelectionContext);
  if (!selectionInfo) throw new Error("No Context");
  const { selectedFlight, selectedPassenger } = selectionInfo;

  const { passengers } = useSelector((state: RootState) => state.booking);

  const passengerIndex = passengers.findIndex(
    (item) => item.email === selectedPassenger?.email
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger data-test="additional-services-trigger" asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[380px] max-h-[400px] overflow-y-auto scrollbar-hide flex flex-col gap-1 p-3 rounded-xl bg-white border border-slate-100 shadow-xl">
        <ul className="flex flex-col gap-3">
          {additionalServices?.[type].map((item, index) => (
            <li key={index}>
              <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden relative shadow-sm">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-sm font-semibold text-slate-800 leading-tight">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.price.toFixed(2)} EUR
                  </span>
                </div>
                <button
                  data-test="add-additional-service"
                  onClick={() => {
                    if (type === "meals") {
                      dispatch(
                        addMeal({
                          meal: {
                            name: item.name,
                            price: item.price,
                            flight: selectedFlight?.flight as Flight,
                          },
                          index: passengerIndex,
                        })
                      );
                    } else {
                      dispatch(
                        addLuggage({
                          luggage: {
                            name: item.name,
                            price: item.price,
                            flight: selectedFlight?.flight as Flight,
                          },
                          index: passengerIndex,
                        })
                      );
                    }
                    toast.success("Service added.");
                    setOpen(false);
                  }}
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-sky-50 hover:bg-sky-100 transition-colors"
                >
                  <Plus size={16} className="text-sky-600" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const ServiceCard = ({ type }: { type: "meals" | "luggage" }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow">
    <div className="w-28 flex-shrink-0 rounded-lg overflow-hidden relative">
      <Image
        src={serviceCardInfo[type].thumbanil}
        alt={serviceCardInfo[type].title}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-1 flex flex-col gap-1 min-w-0">
      <h3 className="font-semibold text-slate-800 text-sm">
        {serviceCardInfo[type].title}
      </h3>
      <p className="flex-1 text-xs text-slate-400 leading-relaxed">
        {serviceCardInfo[type].desc}
      </p>
      <OptionsPopover type={type}>
        <button className="flex items-center gap-1.5 self-start text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors mt-1">
          <Plus size={13} />
          <span>See Options</span>
        </button>
      </OptionsPopover>
    </div>
  </div>
);

const AdditionalServices = () => {
  const { loading } = useSelector((state: RootState) => state.loader);

  const [selectedPassenger, setSelectedPassenger] = useState<Passenger>();
  const [selectedFlight, setSelectedFlight] = useState<BookingFlight>();

  const bookingState = useSelector((state: RootState) => state.booking);
  const { passengers } = bookingState;

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const prevBooking = getBookingState();
    if (!prevBooking) {
      router.push("/");
    } else {
      setSelectedPassenger(prevBooking.passengers[0]);
      setSelectedFlight(prevBooking.flights.going[0]);
      dispatch(updateBooking(prevBooking));
      dispatch(setLoadingState(false));
    }
  }, []);

  useEffect(() => {
    if (!loading && !bookingState) {
      router.push("/");
    }
  }, [bookingState, loading]);

  if (loading || !selectedPassenger || !selectedFlight) return null;

  return (
    <SelectionContext.Provider
      value={{
        selectedPassenger,
        selectedFlight,
        setSelectedFlight: setSelectedFlight as (flight: BookingFlight) => void,
        setSelectedPassenger: setSelectedPassenger as (passenger: Passenger) => void,
      }}
    >
      <div className="flex flex-col py-6 gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Additional Services</h2>
          <p className="text-sm text-slate-400">Enhance your journey with meals, extra luggage, and more.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <PassengerSelector
            selectedPassenger={selectedPassenger}
            setSelectedPassenger={setSelectedPassenger as (passenger: Passenger) => void}
            className="sm:w-56"
          />
          <FlightSelector
            selectedFlight={selectedFlight}
            setSelectedFlight={setSelectedFlight as (flight: BookingFlight) => void}
            className="sm:w-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServiceCard type="meals" />
          <ServiceCard type="luggage" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-800">Added Services</h3>
            <p className="text-sm text-slate-400">Review and manage selected add-ons per passenger.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passengers.map((passenger, index) => (
              <PassengerInfoCard key={index} passenger={passenger} />
            ))}
          </div>
        </div>
      </div>
    </SelectionContext.Provider>
  );
};

export default AdditionalServices;
