"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";

let storeInstance: AppStore | null = null;

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(storeInstance);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeInstance = storeRef.current;
  }

  if (typeof window !== "undefined" && window.Cypress) {
    (window as any).store = storeRef.current;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

export const getStore = () => storeInstance;
