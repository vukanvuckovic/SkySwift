import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { User } from "lucide-react";
import { Passenger } from "@/lib/features/bookingSlice";

const PassengerSelector = ({
  selectedPassenger,
  setSelectedPassenger,
  className,
}: {
  selectedPassenger: Passenger;
  setSelectedPassenger: (passenger: Passenger) => void;
  className?: string;
}) => {
  const { passengers } = useSelector((state: RootState) => state.booking);

  return (
    <Select
      value={selectedPassenger as unknown as string}
      onValueChange={(val) => {
        setSelectedPassenger(val as unknown as Passenger);
      }}
    >
      <SelectTrigger
        className={`w-full flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm ${className}`}
      >
        <div className="flex items-center gap-2">
          <User size={15} className="text-slate-400 flex-shrink-0" />
          <span className="text-slate-700">
            {selectedPassenger?.firstName + " " + selectedPassenger?.lastName}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {passengers.map((passenger: Passenger) => (
          <SelectItem
            key={passenger.email}
            value={passenger as unknown as string}
          >
            {passenger.firstName + " " + passenger.lastName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PassengerSelector;
