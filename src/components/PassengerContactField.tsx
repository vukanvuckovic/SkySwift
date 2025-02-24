import { setContact } from "@/lib/features/bookingSlice";
import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const PassengerContactField = () => {
  const { contact } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 h-fit rounded-xl bg-white shadow-sm shadow-gray-200">
      <div className="flex flex-col">
        <h2 className="max-md:!text-lg">Contact Info</h2>
        <span className="max-md:!text-xs text-sm text-gray-500">
          This is how we are going to inform you about the possible changes.
        </span>
      </div>
      <form
        className="flex flex-col"
        action=""
      >
        <div className="flex-1 flex flex-col gap-1">
          <label
            className="passenger-form-label"
            htmlFor="email"
          >
            Email
          </label>
          <input
            value={contact}
            onChange={(e) => dispatch(setContact(e.target.value))}
            data-test="passenger-info-contact"
            name="email"
            type="email"
            placeholder="Email"
            className="passenger-form-field"
          />
        </div>
      </form>
    </div>
  );
};

export default PassengerContactField;
