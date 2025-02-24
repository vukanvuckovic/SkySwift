import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/features/userSlice";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";

const FormContent = () => {
  const [type, setType] = useState<"login" | "register">("login");
  const [formInfo, setFormInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const LOG_IN = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        firstName
        lastName
        email
      }
    }
  `;

  const REGISTER = gql`
    mutation Register(
      $firstName: String!
      $lastName: String!
      $email: String!
      $password: String!
    ) {
      register(
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      ) {
        id
      }
    }
  `;

  const [login, { loading: loginLoading }] = useMutation(LOG_IN);
  const [register, { loading: registerLoading }] = useMutation(REGISTER);

  const handleRegister = async () => {
    try {
      const { data: registerData } = await register({
        variables: {
          firstName: formInfo.firstName,
          lastName: formInfo.lastName,
          email: formInfo.email,
          password: formInfo.password,
        },
      });

      if (!registerData || !registerData.register.id) {
        toast.warning("Error occured", { description: "Try again." });
      } else {
        toast.success("Registration successful.", {
          description: "You can now log in to your account.",
        });
      }
    } catch (error: any) {
      toast.warning("Error occured", { description: error.message });
    }
  };

  const handleLogin = async () => {
    try {
      const { data: loginData } = await login({
        variables: { email: formInfo.email, password: formInfo.password },
      });

      if (!loginData.login) {
        toast.warning("Error logging in", { description: "Try again." });
        return;
      } else {
        console.log("login data", loginData);
        dispatch(
          setUser({
            id: loginData.login.id,
            firstName: loginData.login.firstName,
            lastName: loginData.login.lastName,
            email: loginData.login.email,
          })
        );
        toast.success("Login successful.");
      }
    } catch (error) {
      toast.warning("Error logging in", { description: "Try again." });
    }
  };
  return (
    <>
      <div className="flex flex-row items-center justify-between px-1">
        {type === "login" ? (
          <>
            <h3>Log in</h3>
            <button
              data-test="register-button"
              onClick={() => setType("register")}
              className="text-xs text-gray-500 outline-none"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <h3>Register</h3>
            <button
              onClick={() => setType("login")}
              className="text-xs text-gray-500 outline-none"
            >
              Log in
            </button>
          </>
        )}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          type === "login" ? await handleLogin() : await handleRegister();
        }}
        className="flex flex-col gap-3"
      >
        {type === "register" && (
          <div className="flex flex-row items-center gap-3 w-full">
            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="firstName"
                className="ml-1 text-xs text-gray-600"
              >
                First Name
              </label>
              <input
                value={formInfo.firstName}
                onChange={(e) =>
                  setFormInfo((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                data-test="auth-first-name"
                required
                name="firstName"
                type="text"
                placeholder="First Name"
                className="transparent-input w-full"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="lastName"
                className="ml-1 text-xs text-gray-600"
              >
                Last Name
              </label>
              <input
                value={formInfo.lastName}
                onChange={(e) =>
                  setFormInfo((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                data-test="auth-last-name"
                required
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="transparent-input w-full"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="ml-1 text-xs text-gray-600"
          >
            Email
          </label>
          <input
            value={formInfo.email}
            onChange={(e) =>
              setFormInfo((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            data-test="auth-email"
            required
            name="email"
            type="email"
            placeholder="Email"
            className="transparent-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="ml-1 text-xs text-gray-600"
          >
            Password
          </label>
          <input
            value={formInfo.password}
            onChange={(e) =>
              setFormInfo((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            data-test="auth-password"
            required
            name="password"
            type="password"
            placeholder="Password"
            className="transparent-input"
          />
        </div>
        <button
          data-test="auth-button"
          className="flex justify-center items-center gap-2 py-2 bg-blue-500 font-medium rounded-md text-white"
        >
          {type === "login"
            ? loginLoading
              ? "Logging in..."
              : "Log in"
            : registerLoading
            ? "Creating an account..."
            : "Register"}
          {registerLoading ||
            (loginLoading && (
              <Loader2
                size={16}
                color="white"
                className="animate-spin"
              />
            ))}
        </button>
      </form>
    </>
  );
};

const AuthComponent = ({
  children,
  wrapperType = "popover",
}: {
  children: React.ReactNode;
  wrapperType?: "popover" | "dialog";
}) => {
  return wrapperType === "popover" ? (
    <Popover>
      <PopoverTrigger
        data-test="login-popover-trigger"
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-md:hidden w-full max-w-[400px] min-w-[300px] flex flex-col p-3 pt-4 gap-4 rounded-lg bg-white/70 backdrop-blur-sm"
      >
        <FormContent />
      </PopoverContent>
    </Popover>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-[400px] min-w-[300px] flex flex-col p-3 pt-4 gap-4 rounded-lg bg-white/70 backdrop-blur-sm">
        {/* <DialogClose className="absolute top-4 right-4">
          <X
            size={16}
            color="white"
          />
        </DialogClose> */}
        <DialogTitle hidden />
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default AuthComponent;
