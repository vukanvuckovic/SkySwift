import { TickCircle } from "iconsax-react";
import React from "react";

const PassengerInfoSignIn = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="flex-1 px-4 md:px-6 py-3 md:py-5 flex flex-col max-md:gap-4 gap-2 bg-[linear-gradient(#239bff,#0084e7)] text-white rounded-lg">
        <h2 className="max-md:!text-lg">
          Benefit from the advantages
          <br />
          by logging in as a member
        </h2>
        <ul className="flex flex-col gap-2 max-md:text-sm">
          <li className="flex flex-row items-center gap-2">
            <TickCircle
              size={12}
              color="#4ade80"
            />
            <span className="leading-tight">Quick access to all your flights</span>
          </li>
          <li className="flex flex-row items-center gap-2">
            <TickCircle
              size={12}
              color="#4ade80"
            />
            <span className="leading-tight">Quick ticketing via registered passengers</span>
          </li>
          <li className="flex flex-row items-center gap-2">
            <TickCircle
              size={12}
              color="#4ade80"
            />
            <span className="leading-tight">Easy online check-in</span>
          </li>
        </ul>
      </div>
      <div className="flex-1 bg-white max-md:p-4 p-6 rounded-lg shadow-md shadow-gray-200">
        <form
          className="flex flex-col gap-4"
          action=""
        >
          <div className="flex flex-col gap-1">
            <label
              className="text-gray-600 font-medium max-md:text-xs text-sm ml-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Username"
              className="border-[1px] border-gray-300 rounded-lg px-3 py-2 max-md:text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="text-gray-600 font-medium max-md:text-xs text-sm ml-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              name="password"
              type="text"
              placeholder="Password"
              className="border-[1px] border-gray-300 rounded-lg px-3 py-2 max-md:text-sm"
            />
          </div>

          <div className="flex flex-row justify-between items-center gap-2 max-md:px-1 px-3">
            <button className="max-md:text-xs text-sm text-gray-500">Remember Me</button>
            <button className="max-md:text-xs text-sm text-gray-500">Forgot Password</button>
          </div>
          <div className="flex flex-row items-center justify-between gap-2">
            <button className="flex-1 max-md:text-sm rounded-lg border-[1px] border-gray-300 text-gray-500 max-md:h-9 h-10">
              Sign Up
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex-1 max-md:text-sm rounded-lg bg-blue-500 max-md:h-9 h-10 text-white font-medium"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerInfoSignIn;
