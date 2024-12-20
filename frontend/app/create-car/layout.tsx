import React from 'react';
import Header from "@/app/landing/components/Header";
import { CARProblemDescContextProvider } from "@/app/_context/CARProblemDescContext";
import { CARProblemRedefContextProvider } from "@/app/_context/CARProblemRedefContext";
// import { CARProblemDesc } from "@/configs/schema";
export default function CreateCARLayout({children}: {children: React.ReactNode}) {

  return (
      <CARProblemDescContextProvider>
        <CARProblemRedefContextProvider>
          <div>
            <Header />
            <h2 className="text-4xl text-primary font-medium text-center mt-10">
                  Corrective Action Request (CAR)
            </h2>          
            <div className="px-10 md:px-20 lg:px-44 mt-3">
              {children}
            </div>
          </div>
        </CARProblemRedefContextProvider>
      </CARProblemDescContextProvider>
  )
}
