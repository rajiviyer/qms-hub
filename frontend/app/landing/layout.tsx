import React, { useState, useEffect } from "react";
import Header from "./components/Header";


export default function LandingPageLayout({children}: {children: React.ReactNode}) {
  return (
  <div>
    <div>
      <Header />
      <div className="p-10">{children}</div>
    </div>
  </div>
  )
}
