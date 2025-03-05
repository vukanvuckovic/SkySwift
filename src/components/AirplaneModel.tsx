"use client";
import { Check } from "lucide-react";
import React, { useContext } from "react";
import FlightSelector from "./FlightSelector";
import SeatSelector from "./SeatSelector";
import { SeatContext } from "@/context/seatContext";
import { AdditionalOption, AirplaneData } from "@/lib/features/bookingSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";


const AirplaneModel = ({ airplaneData }: { airplaneData: AirplaneData }) => {
  const seatInfo = useContext(SeatContext);
  if (!seatInfo) throw new Error("No Context");
  const { selectedPassenger, selectedFlight, setSelectedFlight } = seatInfo;

  const { passengers } = useSelector((state: RootState) => state.booking);

  const isSeatTaken = (
    flightId: string,
    seatName: string,
    selectedPassengerEmail?: string
  ) => {
    const passenger = passengers.find(
      (item) => item.email === selectedPassengerEmail
    );

    if (
      passenger?.seats.find(
        (item: AdditionalOption) =>
          item.flight._id === selectedFlight?.flight._id
      )?.name === seatName
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="flex-1 flex flex-row items-center md:pt-8 w-full max-w-[600px] max-lg:self-center">
      <span className="max-md:hidden -rotate-90 text-sm text-slate-400 font-semibold tracking-widest uppercase">
        Wing
      </span>
      <div className="flex-1 flex flex-col">
        <div className="h-[300px] flex flex-col gap-3 justify-center items-center rounded-t-full bg-white shadow-md shadow-black/20">
          <p className="text-sm font-semibold text-slate-500">{airplaneData.name}</p>
          <FlightSelector
            selectedFlight={selectedFlight}
            setSelectedFlight={setSelectedFlight}
          />
        </div>
        <div className="airplane flex-1 flex flex-col gap-10 max-md:p-2 p-4 bg-white shadow-md shadow-slate-200">
          <div className="flex flex-row items-center justify-between px-4">
            {airplaneData.ailes
              .slice(0, airplaneData.ailes.length / 2)
              .map((aile: string, index: number) => (
                <span
                  key={index}
                  className="text-center"
                >
                  {aile}
                </span>
              ))}
            <span className="text-center"></span>
            {airplaneData.ailes
              .slice(airplaneData.ailes.length / 2)
              .map((aile: string, index: number) => (
                <span
                  key={index}
                  className="text-center"
                >
                  {aile}
                </span>
              ))}
          </div>
          {airplaneData.seats.map((item, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-4 p-4 rounded-t-xl bg-[linear-gradient(#eff6ff,#fff)]"
              >
                <div className="flex flex-row items-center justify-between">
                  <h3 className="leading-none">{item.name}</h3>
                  <span className="font-semibold leading-none">
                    {item.price.toFixed(2)} EUR
                  </span>
                </div>
                <ul className="flex flex-col">
                  {item.benefits.map((item: string, index: number) => {
                    return (
                      <li
                        key={index}
                        className="flex flex-row items-center gap-2"
                      >
                        <Check size={12} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex flex-col gap-3">
                  {Array.from({
                    length: item.rowsTo - item.rowsFrom + 1,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[60px] flex flex-row items-center gap-3 justify-between"
                    >
                      {airplaneData.ailes
                        .slice(0, airplaneData.ailes.length / 2)
                        .map((aile: string, index2: number) => (
                          <SeatSelector
                            key={index2}
                            seat={{
                              name: `${aile}${index + item.rowsFrom}`,
                              price: item.price,
                            }}
                          >
                            <button
                              disabled={
                                isSeatTaken(
                                  selectedFlight?.flight._id,
                                  `${aile}${index + item.rowsFrom}`,
                                  selectedPassenger?.email
                                ) ||
                                selectedFlight?.flight.takenSeats.includes(
                                  `${aile}${index + item.rowsFrom}`
                                )
                              }
                              data-test="seat-button"
                              className="seat"
                            >
                              {aile}
                              {index + item.rowsFrom}
                              {selectedFlight?.flight.takenSeats.includes(
                                `${aile}${index + item.rowsFrom}`
                              ) && (
                                <span className="text-[8px] font-light leading-none">
                                  Taken
                                </span>
                              )}
                            </button>
                          </SeatSelector>
                        ))}
                      <span className="flex-1 text-center">
                        {index + item.rowsFrom}
                      </span>
                      {airplaneData.ailes
                        .slice(airplaneData.ailes.length / 2)
                        .map((aile: string, index2: number) => (
                          <SeatSelector
                            key={index2}
                            seat={{
                              name: `${aile}${index + item.rowsFrom}`,
                              price: item.price,
                            }}
                          >
                            <button
                              disabled={
                                isSeatTaken(
                                  selectedFlight?.flight._id,
                                  `${aile}${index + item.rowsFrom}`,
                                  selectedPassenger?.email
                                ) ||
                                selectedFlight?.flight.takenSeats.includes(
                                  `${aile}${index + item.rowsFrom}`
                                )
                              }
                              className="seat"
                            >
                              {aile}
                              {index + item.rowsFrom}
                              {selectedFlight?.flight.takenSeats.includes(
                                `${aile}${index + item.rowsFrom}`
                              ) && (
                                <span className="text-[8px] font-light leading-none">
                                  Taken
                                </span>
                              )}
                            </button>
                          </SeatSelector>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <span className="max-md:hidden rotate-90 text-sm text-slate-400 font-semibold tracking-widest uppercase">
        Wing
      </span>
    </div>
  );
};

export default AirplaneModel;
