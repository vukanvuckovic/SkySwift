import {
  AdditionalOption,
  Passenger,
  removeLuggage,
  removeMeal,
  removeSeat,
} from "@/lib/features/bookingSlice";
import { RootState } from "@/lib/store";
import { ArrowDown2, Profile } from "iconsax-react";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const PassengerInfoCard = ({
  passenger,
  preview = false,
}: {
  passenger: Passenger;
  preview?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const { passengers } = useSelector((state: RootState) => state.booking);

  const passengerIndex = passengers.findIndex(
    (item) => item.email === passenger.email
  );

  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-10 bg-white rounded-xl p-4 shadow-md shadow-gray-200">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="max-md:h-10 h-12 aspect-square bg-gray-100 rounded-full flex justify-center items-center">
            <Profile
              size={20}
              color="gray"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="max-md:text-sm">
              {passenger.firstName + " " + passenger.lastName}
            </h3>
            <span className="max-md:text-xs text-sm text-gray-400">Adult</span>
          </div>
        </div>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center"
        >
          <ArrowDown2
            size={12}
            color="blue"
          />
        </button>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-6 px-2">
          <div className="flex flex-col gap-1">
            <h3 className="max-md:text-sm">Seats selected</h3>
            <ol className="flex flex-col gap-1">
              {passenger.seats.length > 0 ? (
                passenger.seats.map((seat: AdditionalOption, index: number) => (
                  <li
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-500 max-md:text-sm">
                      {seat.name} on {seat.flight.from.city} -{" "}
                      {seat.flight.to.city}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-600">
                        {seat.price.toFixed(2)} EUR
                      </span>
                      {!preview && (
                        <button
                          onClick={() => {
                            dispatch(
                              removeSeat({
                                seatFlight: seat.flight._id,
                                index: passengerIndex,
                              })
                            );
                            toast.success("Seat removed.");
                          }}
                        >
                          <X
                            size={14}
                            color="red"
                          />
                        </button>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="flex items-center justify-between">
                  <span className="text-gray-500 max-md:text-sm">
                    No seats selected.
                  </span>
                  <span className="font-medium text-gray-600 max-md:text-xs text-sm">
                    0.00 EUR
                  </span>
                </li>
              )}
            </ol>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="max-md:text-sm">Meals selected</h3>
            <ol className="flex flex-col gap-1">
              {passenger.meals.length > 0 ? (
                passenger.meals.map((meal: AdditionalOption, index: number) => (
                  <li
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-500 max-md:text-sm">
                      {meal.quantity} {meal.name} on {meal.flight.from.city} -{" "}
                      {meal.flight.to.city}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-600">
                        {(meal.price * meal.quantity!).toFixed(2)} EUR
                      </span>
                      {!preview && (
                        <button
                          onClick={() => {
                            dispatch(
                              removeMeal({
                                meal,
                                index: passengerIndex,
                              })
                            );
                            toast.success("Meal removed");
                          }}
                        >
                          <X
                            size={14}
                            color="red"
                          />
                        </button>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="flex items-center justify-between">
                  <span className="text-gray-500 max-md:text-sm">
                    No meals selected.
                  </span>
                  <span className="font-medium text-gray-600 max-md:text-xs text-sm">
                    0.00 EUR
                  </span>
                </li>
              )}
            </ol>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="max-md:text-sm">Luggage selected</h3>
            <ol className="flex flex-col gap-1">
              {passenger.luggage.length > 0 ? (
                passenger.luggage.map(
                  (luggage: AdditionalOption, index: number) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-500 max-md:text-sm">
                        {luggage.name} on {luggage.flight.from.city} -{" "}
                        {luggage.flight.to.city}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-600">
                          {luggage.price.toFixed(2)} EUR
                        </span>
                        {!preview && (
                          <button
                            onClick={() => {
                              dispatch(
                                removeLuggage({
                                  luggage: luggage,
                                  index: passengerIndex,
                                })
                              );
                              toast.success("Luggage removed.");
                            }}
                          >
                            <X
                              size={14}
                              color="red"
                            />
                          </button>
                        )}
                      </div>
                    </li>
                  )
                )
              ) : (
                <li className="flex items-center justify-between">
                  <span className="text-gray-500 max-md:text-sm">
                    No luggage selected.
                  </span>
                  <span className="font-medium text-gray-600 max-md:text-xs text-sm">
                    0.00 EUR
                  </span>
                </li>
              )}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerInfoCard;
