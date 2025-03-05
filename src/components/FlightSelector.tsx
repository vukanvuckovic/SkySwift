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
  setSelectedFlight: (flight: BookingFlight) => void;
  className?: string;
}) => {
  const { flights } = useSelector((state: RootState) => state.booking);

  return (
    <Select
      value={selectedFlight as unknown as string}
      onValueChange={(val) => {
        setSelectedFlight(val as unknown as BookingFlight);
      }}
    >
      <SelectTrigger
        className={`w-fit px-3 py-2 gap-2 bg-white rounded-lg border border-slate-200 text-sm ${className}`}
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
