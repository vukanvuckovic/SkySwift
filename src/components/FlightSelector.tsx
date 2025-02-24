import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { ArrowRight } from "lucide-react";
import { BookingFlight } from "@/lib/features/bookingSlice";

const FlightSelector = ({
  selectedFlight,
  setSelectedFlight,
  className,
}: {
  selectedFlight: BookingFlight;
  setSelectedFlight: Function;
  className?: string;
}) => {
  const { flights } = useSelector((state: RootState) => state.booking);

  return (
    <Select
      value={selectedFlight as any}
      onValueChange={(val) => {
        setSelectedFlight(val);
      }}
    >
      <SelectTrigger
        className={`w-fit p-2 px-3 gap-2 bg-white rounded-lg border-[1px] border-gray-200 max-md:text-xs text-sm ${className}`}
      >
        <div className="flex items-center gap-2">
          <span>{selectedFlight?.flight.from.city}</span>
          <ArrowRight
            size={14}
            color="black"
          />
          <span>{selectedFlight?.flight.to.city}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {[...flights.going, ...flights.returning].map(
          (flightObject: BookingFlight) => (
            <SelectItem
              defaultChecked={
                flightObject.flight._id === selectedFlight?.flight._id
              }
              key={flightObject.flight.id}
              value={flightObject as any}
            >
              <div className="flex items-center gap-2">
                <span>{flightObject.flight.from.city}</span>
                <ArrowRight
                  size={14}
                  color="black"
                />
                <span>{flightObject.flight.to.city}</span>
              </div>
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
};

export default FlightSelector;
