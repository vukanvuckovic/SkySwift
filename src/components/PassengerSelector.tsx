import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Profile } from "iconsax-react";
import { Passenger } from "@/lib/features/bookingSlice";

const PassengerSelector = ({
  selectedPassenger,
  setSelectedPassenger,
  className,
}: {
  selectedPassenger: Passenger;
  setSelectedPassenger: Function;
  className?: string;
}) => {
  const { passengers } = useSelector((state: RootState) => state.booking);

  return (
    <Select
      value={selectedPassenger as any}
      onValueChange={(val) => {
        setSelectedPassenger(val);
      }}
    >
      <SelectTrigger
        className={`w-full flex items-center gap-2 p-2 px-3 bg-white rounded-lg border-[1px] border-gray-200 max-md:text-xs text-sm ${className}`}
      >
        <div className="flex items-center gap-2">
          <Profile
            size={16}
            color="black"
            className="flex-shrink-0"
          />
          <span>
            {selectedPassenger?.firstName + " " + selectedPassenger?.lastName}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {passengers.map((passenger: Passenger) => (
          <SelectItem
            defaultChecked={passenger.email === selectedPassenger?.email}
            key={passenger.email}
            value={passenger as any}
          >
            {passenger.firstName + " " + passenger.lastName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PassengerSelector;
