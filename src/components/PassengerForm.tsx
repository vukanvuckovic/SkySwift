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
import { ArrowUp2 } from "iconsax-react";
import { PersonStanding } from "lucide-react";
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

  const { errors } = useSelector((state: RootState) => state.booking);

  // Validation function
  const validateField = (field: string, value: string) => {
    if (!value || value === "") {
      dispatch(setError({ index, field, message: `This field is required.` }));
    } else {
      dispatch(clearError({ index, field }));
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 rounded-xl bg-white shadow-sm shadow-gray-200">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center max-md:gap-3 gap-4">
          <div className="max-md:h-10 h-12 aspect-square rounded-full bg-gray-100 border-[1px] border-gray-200 flex justify-center items-center">
            <PersonStanding
              size={24}
              color="gray"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="max-md:!text-base">{index + 1}. Adult Passenger</h3>
            <span className="max-md:text-xs text-sm">12+</span>
          </div>
        </div>
        <div className="max-md:h-6 h-8 aspect-square rounded-full flex justify-center items-center bg-blue-500">
          <ArrowUp2
            size={16}
            color="white"
          />
        </div>
      </div>
      <form className="flex flex-col gap-6">
        <div className="flex max-md:flex-col flex-row gap-2">
          <div
            id={"firstName" + index}
            className="flex-1 flex flex-col gap-1"
          >
            <label
              className="passenger-form-label"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              value={info?.firstName ?? ""}
              onChange={(e) =>
                dispatch(
                  setFirstName({ firstName: e.target.value, index: index })
                )
              }
              data-test="passenger-info-first-name"
              onBlur={(e) => validateField("firstName", e.target.value)}
              id={"firstName" + index}
              name="firstName"
              type="text"
              placeholder="First Name"
              className="passenger-form-field"
            />
            <span className="text-xs text-red-400">
              {errors[index]?.firstName}
            </span>
          </div>
          <div
            id={"lastName" + index}
            className="flex-1 flex flex-col gap-1"
          >
            <label
              className="passenger-form-label"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              value={info?.lastName ?? ""}
              onChange={(e) =>
                dispatch(
                  setLastName({ lastName: e.target.value, index: index })
                )
              }
              data-test="passenger-info-last-name"
              onBlur={(e) => validateField("lastName", e.target.value)}
              id={"lastName" + index}
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="passenger-form-field"
            />
            <span className="text-xs text-red-400">
              {errors[index]?.lastName}
            </span>
          </div>
        </div>
        <div
          id={"dateOfBirth" + index}
          className="flex-1 flex flex-col gap-1"
        >
          <label
            className="passenger-form-label"
            htmlFor="dateOfBirth"
          >
            Date of birth
          </label>
          <input
            value={info?.dateOfBirth ?? ""}
            onBlur={(e) => validateField("dateOfBirth", e.target.value)}
            onChange={(e) =>
              dispatch(
                setDateOfBirth({ dateOfBirth: e.target.value, index: index })
              )
            }
            data-test="passenger-info-birth"
            name="dateOfBirth"
            type="date"
            placeholder="Date of birth"
            className="passenger-form-field"
          />
          <span className="text-xs text-red-400">
            {errors[index]?.dateOfBirth}
          </span>
        </div>

        <div
          id={"gender" + index}
          className="flex flex-col gap-1"
        >
          <span className="text-gray-600 font-medium text-lg mb-1">Gender</span>
          <div className="flex flex-row items-center gap-1 ml-1">
            <input
              checked={info.gender === "male"}
              onChange={(e) =>
                dispatch(
                  setGender({
                    gender: e.target.value as "male" | "female",
                    index,
                  })
                )
              }
              onBlur={(e) => validateField("gender", e.target.value)}
              data-test="passenger-info-gender"
              type="radio"
              name="gender"
              value="male"
            />
            <label
              className="text-gray-600 font-medium text-sm"
              htmlFor="gender"
            >
              Male
            </label>
          </div>
          <div className="flex flex-row items-center gap-1 ml-1">
            <input
              checked={info.gender === "female"}
              onChange={(e) =>
                dispatch(
                  setGender({
                    gender: e.target.value as "male" | "female",
                    index,
                  })
                )
              }
              onBlur={(e) => validateField("gender", e.target.value)}
              type="radio"
              name="gender"
              value="female"
            />
            <label
              className="text-gray-600 font-medium text-sm"
              htmlFor="gender"
            >
              Female
            </label>
          </div>
          <span className="text-xs text-red-400">{errors[index]?.gender}</span>
        </div>
        <div className="flex flex-row max-md:flex-col gap-2">
          <div
            id={"email" + index}
            className="flex-1 flex flex-col gap-1"
          >
            <label
              className="passenger-form-label"
              htmlFor="email"
            >
              Email
            </label>
            <input
              value={info?.email ?? ""}
              onChange={(e) =>
                dispatch(setEmail({ email: e.target.value, index: index }))
              }
              onBlur={(e) => validateField("email", e.target.value)}
              data-test="passenger-info-email"
              name="email"
              type="text"
              placeholder="Email"
              className="passenger-form-field"
            />
            <span className="text-xs text-red-400">{errors[index]?.email}</span>
          </div>
          <div
            id={"phone" + index}
            className="flex-1 flex flex-col gap-1"
          >
            <label
              className="passenger-form-label"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <input
              value={info?.phone ?? ""}
              onChange={(e) =>
                dispatch(setPhone({ phone: e.target.value, index: index }))
              }
              onBlur={(e) => validateField("phone", e.target.value)}
              data-test="passenger-info-phone"
              name="phoneNumber"
              type="text"
              placeholder="Phone Number"
              className="passenger-form-field"
            />
            <span className="text-xs text-red-400">{errors[index]?.phone}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;
