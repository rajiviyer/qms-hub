import React from 'react';
import Header from "@/app/landing/components/Header";

export default function CreateCARLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <Header />
        {children}
    </div>
  )
}
