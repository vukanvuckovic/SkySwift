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
  Flight,
  updateBooking,
} from "@/lib/features/bookingSlice";
import { setLoadingState } from "@/lib/features/loaderSlice";
import { getBookingState } from "@/lib/localStorage";
import { RootState } from "@/lib/store";
import { Add } from "iconsax-react";
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
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        data-test="additional-services-trigger"
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[400px] h-fit max-h-[400px] overflow-y-auto scrollbar-hide flex flex-col gap-1 p-3 rounded-lg bg-white border-[1px] border-gray-200 shadow-md shadow-black/10">
        <ul className="flex flex-col gap-4">
          {additionalServices?.[type].map((item, index) => {
            return (
              <li key={index}>
                <div className="flex flex-row items-center gap-2">
                  <div className="h-16 aspect-square rounded-lg overflow-hidden relative shadow-md shadow-gray-200">
                    <Image
                      src={item.img}
                      alt="service"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <span className="font-medium leading-none">
                      {item.name}
                    </span>
                    <span className="text-gray-500 text-sm leading-none">
                      {item.price.toFixed(2)} EUR
                    </span>
                  </div>
                  <button
                    data-test="add-additional-service"
                    onClick={() => {
                      type === "meals"
                        ? dispatch(
                            addMeal({
                              meal: {
                                name: item.name,
                                price: item.price,
                                flight: selectedFlight?.flight,
                              },
                              index: passengerIndex,
                            })
                          )
                        : type === "luggage" &&
                          dispatch(
                            addLuggage({
                              luggage: {
                                name: item.name,
                                price: item.price,
                                flight: selectedFlight?.flight,
                              },
                              index: passengerIndex,
                            })
                          );
                      toast.success("Service Added");
                      setOpen(false);
                    }}
                    className="h-10 aspect-square flex justify-center items-center rounded-lg hover:bg-gray-100 duration-200 outline-none"
                  >
                    <Plus
                      size={18}
                      color="blue"
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const ServiceCard = ({ type }: { type: "meals" | "luggage" }) => {
  return (
    <div className="flex flex-row max-md:gap-3 gap-4 max-md:p-2 p-4 rounded-xl bg-white shadow-sm shadow-gray-200">
      <div className="flex-1 max-md:min-h-[120px] min-h-[150px] relative rounded-md overflow-hidden">
        <Image
          src={serviceCardInfo[type].thumbanil}
          alt="service"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold max-md:text-sm">
          {serviceCardInfo[type].title}
        </h3>
        <span className="flex-1 max-md:text-xs text-gray-500">
          {serviceCardInfo[type].desc}
        </span>
        <OptionsPopover type={type}>
          <div className="flex flex-row items-center gap-1 self-end max-md:text-xs text-sm text-blue-500 select-none cursor-pointer">
            <Add
              size={16}
              color="#3b82f6"
            />
            <span>See Options</span>
          </div>
        </OptionsPopover>
      </div>
    </div>
  );
};

const AdditionalServices = () => {
  const { loading } = useSelector((state: RootState) => state.loader);

  const [selectedPassenger, setSelectedPassenger] = useState();
  const [selectedFlight, setSelectedFlight] = useState();

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

  if (loading || !selectedPassenger || !selectedFlight) return;

  return (
    <SelectionContext.Provider
      value={{
        selectedPassenger,
        selectedFlight,
        setSelectedFlight,
        setSelectedPassenger,
      }}
    >
      <div className="flex flex-col max-md:py-6 py-8 max-md:gap-6 gap-8">
        <div className="flex flex-row max-md:flex-col items-start md:items-center justify-between max-md:gap-3 gap-4">
          <h2 className="max-md:text-lg max-md:ml-1">Additional Services</h2>
          <div className="flex flex-col max-md:w-full md:flex-row md:items-center gap-2">
            <PassengerSelector
              selectedPassenger={selectedPassenger}
              setSelectedPassenger={setSelectedPassenger}
            />
            <FlightSelector
              className="max-md:w-full"
              selectedFlight={selectedFlight}
              setSelectedFlight={setSelectedFlight}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceCard type={"meals"} />
          <ServiceCard type={"luggage"} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="max-md:text-lg max-md:ml-1">Added Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passengers.map((passenger, index) => (
              <PassengerInfoCard
                key={index}
                passenger={passenger}
              />
            ))}
          </div>
        </div>
      </div>
    </SelectionContext.Provider>
  );
};

export default AdditionalServices;
