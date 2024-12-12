"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { UserContextProvider } from "@/app/_context/UserContext";
// import { User } from "@/configs/schema";


export default function LandingPageLayout({children}: {children: React.ReactNode}) {
  return (
      <div>
        <UserContextProvider>
          <Header />
          <div className="p-10">{children}</div>
        </UserContextProvider>
      </div>
  )
}
