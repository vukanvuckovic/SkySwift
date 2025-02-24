"use client"
import ApolloAppProvider from "@/app/ApolloProvider";
import StoreProvider from "@/app/StoreProvider";
import React from "react";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ApolloAppProvider>{children}</ApolloAppProvider>
    </StoreProvider>
  );
};

export default LayoutWrapper;
