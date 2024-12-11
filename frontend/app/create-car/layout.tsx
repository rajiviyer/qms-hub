"use client";
import React, { useState } from 'react';
import Header from "@/app/landing/components/Header";
import { CARProblemDescContextProvider } from "@/app/_context/CARProblemDescContext";
// import { CARProblemDesc } from "@/configs/schema";
export default function CreateCARLayout({children}: {children: React.ReactNode}) {

  return (
    <div>
      <CARProblemDescContextProvider>
        <Header />
        {children}
      </CARProblemDescContextProvider>
    </div>
  )
}
