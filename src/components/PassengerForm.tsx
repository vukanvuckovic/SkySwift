import {
  clearError,
  Passenger,
  setDateOfBirth,
  setEmail,
  setError,
  setFirstName,
  setGender,
  setLastName,
  setPhone,
} from "@/lib/features/bookingSlice";
import { RootState } from "@/lib/store";
import { User } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const PassengerForm = ({
  info,
  index,
}: {
  info: Passenger;
  index: number;
}) => {
  const dispatch = useDispatch();
  const { errors, passengers } = useSelector((state: RootState) => state.booking);

  const validateField = (field: string, value: string) => {
    if (!value || value === "") {
      dispatch(setError({ index, field, message: "This field is required." }));
      return;
    }
    if (field === "email") {
      const isDuplicate = passengers.some((p, i) => i !== index && p.email === value);
      if (isDuplicate) {
        dispatch(setError({ index, field, message: "This email is already used by another passenger." }));
        return;
      }
    }
    dispatch(clearError({ index, field }));
  };

  const inputClass =
    "w-full border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 transition-all duration-150 placeholder:text-slate-300";

  const labelClass = "text-xs font-semibold text-slate-400 uppercase tracking-wider ml-0.5";

  return (
    <div className="flex flex-col gap-5 p-4 md:p-5 rounded-xl bg-white border border-slate-100 shadow-card">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center">
            <User size={18} className="text-sky-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">
              Passenger {index + 1}
            </h3>
            <span className="text-xs text-slate-400">Adult · 12+ years</span>
          </div>
        </div>
        <span className="text-xs text-slate-300 font-mono">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <form className="flex flex-col gap-4">
        {/* Name row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClass}>First Name</label>
            <input
              value={info?.firstName ?? ""}
              onChange={(e) =>
                dispatch(setFirstName({ firstName: e.target.value, index }))
              }
              data-test="passenger-info-first-name"
              onBlur={(e) => validateField("firstName", e.target.value)}
              name="firstName"
              type="text"
              placeholder="First name"
              className={inputClass}
            />
            {errors[index]?.firstName && (
              <span className="text-xs text-red-400 ml-0.5">{errors[index].firstName}</span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClass}>Last Name</label>
            <input
              value={info?.lastName ?? ""}
              onChange={(e) =>
                dispatch(setLastName({ lastName: e.target.value, index }))
              }
              data-test="passenger-info-last-name"
              onBlur={(e) => validateField("lastName", e.target.value)}
              name="lastName"
              type="text"
              placeholder="Last name"
              className={inputClass}
            />
            {errors[index]?.lastName && (
              <span className="text-xs text-red-400 ml-0.5">{errors[index].lastName}</span>
            )}
          </div>
        </div>

        {/* Date of birth */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Date of Birth</label>
          <input
            value={info?.dateOfBirth ?? ""}
            onChange={(e) =>
              dispatch(setDateOfBirth({ dateOfBirth: e.target.value, index }))
            }
            onBlur={(e) => validateField("dateOfBirth", e.target.value)}
            data-test="passenger-info-birth"
            name="dateOfBirth"
            type="date"
            className={inputClass}
          />
          {errors[index]?.dateOfBirth && (
            <span className="text-xs text-red-400 ml-0.5">{errors[index].dateOfBirth}</span>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Gender</label>
          <div className="flex items-center gap-4">
            {(["male", "female"] as const).map((g) => (
              <label
                key={g}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 text-sm ${
                  info.gender === g
                    ? "border-sky-400 bg-sky-50 text-sky-700 font-medium"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <input
                  checked={info.gender === g}
                  onChange={(e) =>
                    dispatch(setGender({ gender: e.target.value as "male" | "female", index }))
                  }
                  onBlur={(e) => validateField("gender", e.target.value)}
                  data-test="passenger-info-gender"
                  type="radio"
                  name={`gender-${index}`}
                  value={g}
                  className="sr-only"
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>
          {errors[index]?.gender && (
            <span className="text-xs text-red-400 ml-0.5">{errors[index].gender}</span>
          )}
        </div>

        {/* Contact info */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClass}>Email</label>
            <input
              value={info?.email ?? ""}
              onChange={(e) =>
                dispatch(setEmail({ email: e.target.value, index }))
              }
              onBlur={(e) => validateField("email", e.target.value)}
              data-test="passenger-info-email"
              name="email"
              type="email"
              placeholder="email@example.com"
              className={inputClass}
            />
            {errors[index]?.email && (
              <span className="text-xs text-red-400 ml-0.5">{errors[index].email}</span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClass}>Phone Number</label>
            <input
              value={info?.phone ?? ""}
              onChange={(e) =>
                dispatch(setPhone({ phone: e.target.value, index }))
              }
              onBlur={(e) => validateField("phone", e.target.value)}
              data-test="passenger-info-phone"
              name="phoneNumber"
              type="tel"
              placeholder="+1 234 567 8900"
              className={inputClass}
            />
            {errors[index]?.phone && (
              <span className="text-xs text-red-400 ml-0.5">{errors[index].phone}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;
