import {
  AdditionalOption,
  Passenger,
  removeLuggage,
  removeMeal,
  removeSeat,
} from "@/lib/features/bookingSlice";
import { RootState } from "@/lib/store";
import { ChevronDown, ChevronUp, User, X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const ServiceRow = ({
  label,
  price,
  onRemove,
  preview,
}: {
  label: string;
  price: string;
  onRemove?: () => void;
  preview?: boolean;
}) => (
  <li className="flex items-center justify-between py-1.5">
    <span className="text-sm text-slate-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-slate-700">{price} EUR</span>
      {!preview && onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 rounded hover:bg-red-50 transition-colors"
        >
          <X size={13} className="text-red-400" />
        </button>
      )}
    </div>
  </li>
);

const PassengerInfoCard = ({
  passenger,
  preview = false,
}: {
  passenger: Passenger;
  preview?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const { passengers } = useSelector((state: RootState) => state.booking);
  const passengerIndex = passengers.findIndex((item) => item.email === passenger.email);
  const dispatch = useDispatch();

  const totalExtras =
    passenger.seats.length + passenger.meals.length + passenger.luggage.length;

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-sky-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">
              {passenger.firstName} {passenger.lastName}
            </p>
            <p className="text-xs text-slate-400">
              Adult · {totalExtras > 0 ? `${totalExtras} add-on${totalExtras !== 1 ? "s" : ""}` : "No add-ons"}
            </p>
          </div>
        </div>
        {collapsed ? (
          <ChevronDown size={16} className="text-slate-400" />
        ) : (
          <ChevronUp size={16} className="text-slate-400" />
        )}
      </button>

      {!collapsed && (
        <div className="border-t border-slate-100 px-4 md:px-5 py-4 flex flex-col gap-5">
          {/* Seats */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seats</p>
            <ol>
              {passenger.seats.length > 0 ? (
                passenger.seats.map((seat: AdditionalOption, i: number) => (
                  <ServiceRow
                    key={i}
                    label={`${seat.name} · ${seat.flight.from.city} → ${seat.flight.to.city}`}
                    price={seat.price.toFixed(2)}
                    preview={preview}
                    onRemove={() => {
                      dispatch(removeSeat({ seatFlight: seat.flight._id, index: passengerIndex }));
                      toast.success("Seat removed.");
                    }}
                  />
                ))
              ) : (
                <li className="text-sm text-slate-400 py-1">None selected</li>
              )}
            </ol>
          </div>

          {/* Meals */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meals</p>
            <ol>
              {passenger.meals.length > 0 ? (
                passenger.meals.map((meal: AdditionalOption, i: number) => (
                  <ServiceRow
                    key={i}
                    label={`${meal.quantity}× ${meal.name} · ${meal.flight.from.city} → ${meal.flight.to.city}`}
                    price={(meal.price * (meal.quantity ?? 1)).toFixed(2)}
                    preview={preview}
                    onRemove={() => {
                      dispatch(removeMeal({ meal, index: passengerIndex }));
                      toast.success("Meal removed.");
                    }}
                  />
                ))
              ) : (
                <li className="text-sm text-slate-400 py-1">None selected</li>
              )}
            </ol>
          </div>

          {/* Luggage */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Luggage</p>
            <ol>
              {passenger.luggage.length > 0 ? (
                passenger.luggage.map((luggage: AdditionalOption, i: number) => (
                  <ServiceRow
                    key={i}
                    label={`${luggage.name} · ${luggage.flight.from.city} → ${luggage.flight.to.city}`}
                    price={luggage.price.toFixed(2)}
                    preview={preview}
                    onRemove={() => {
                      dispatch(removeLuggage({ luggage, index: passengerIndex }));
                      toast.success("Luggage removed.");
                    }}
                  />
                ))
              ) : (
                <li className="text-sm text-slate-400 py-1">None selected</li>
              )}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerInfoCard;
