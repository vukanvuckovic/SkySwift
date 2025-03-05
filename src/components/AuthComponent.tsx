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

      if (!registerData?.register?.id) {
        toast.warning("Registration failed", { description: "Please try again." });
      } else {
        toast.success("Account created!", {
          description: "You can now sign in to your account.",
        });
        setType("login");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast.warning("Registration failed", { description: message });
    }
  };

  const handleLogin = async () => {
    try {
      const { data: loginData } = await login({
        variables: { email: formInfo.email, password: formInfo.password },
      });

      if (!loginData?.login) {
        toast.warning("Sign in failed", { description: "Please try again." });
        return;
      }

      dispatch(
        setUser({
          id: loginData.login.id,
          firstName: loginData.login.firstName,
          lastName: loginData.login.lastName,
          email: loginData.login.email,
        })
      );
      toast.success("Welcome back!");
    } catch {
      toast.warning("Sign in failed", { description: "Please check your credentials." });
    }
  };

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 outline-none transition-all duration-150 placeholder:text-slate-400";

  return (
    <div className="flex flex-col gap-4 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-800">
          {type === "login" ? "Welcome back" : "Create account"}
        </h3>
        <button
          data-test="register-button"
          onClick={() => setType(type === "login" ? "register" : "login")}
          className="text-xs text-sky-600 font-medium hover:text-sky-700 transition-colors outline-none"
        >
          {type === "login" ? "Register instead" : "Sign in instead"}
        </button>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (type === "login") {
            await handleLogin();
          } else {
            await handleRegister();
          }
        }}
        className="flex flex-col gap-3"
      >
        {type === "register" && (
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="firstName" className="text-xs font-medium text-slate-500 ml-0.5">
                First Name
              </label>
              <input
                value={formInfo.firstName}
                onChange={(e) => setFormInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                data-test="auth-first-name"
                required
                name="firstName"
                type="text"
                placeholder="First name"
                className={inputClass}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="lastName" className="text-xs font-medium text-slate-500 ml-0.5">
                Last Name
              </label>
              <input
                value={formInfo.lastName}
                onChange={(e) => setFormInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                data-test="auth-last-name"
                required
                name="lastName"
                type="text"
                placeholder="Last name"
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs font-medium text-slate-500 ml-0.5">
            Email address
          </label>
          <input
            value={formInfo.email}
            onChange={(e) => setFormInfo((prev) => ({ ...prev, email: e.target.value }))}
            data-test="auth-email"
            required
            name="email"
            type="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-xs font-medium text-slate-500 ml-0.5">
            Password
          </label>
          <input
            value={formInfo.password}
            onChange={(e) => setFormInfo((prev) => ({ ...prev, password: e.target.value }))}
            data-test="auth-password"
            required
            name="password"
            type="password"
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        <button
          data-test="auth-button"
          type="submit"
          disabled={loginLoading || registerLoading}
          className="flex justify-center items-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 font-semibold rounded-lg text-white text-sm transition-colors disabled:opacity-70 mt-1"
        >
          {loginLoading || registerLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              {type === "login" ? "Signing in…" : "Creating account…"}
            </>
          ) : type === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
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
      <PopoverTrigger data-test="login-popover-trigger" asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-md:hidden w-full max-w-[380px] min-w-[320px] flex flex-col p-4 rounded-xl bg-white shadow-xl border border-slate-100"
      >
        <FormContent />
      </PopoverContent>
    </Popover>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-[400px] min-w-[320px] flex flex-col p-5 rounded-xl bg-white">
        <DialogTitle hidden />
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default AuthComponent;
