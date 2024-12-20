"use client";
import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
import { CARProblemDesc } from "@/configs/schema";

interface CARProblemDescContextType {
  carProblemDesc: CARProblemDesc;
  setCarProblemDesc: React.Dispatch<React.SetStateAction<CARProblemDesc>>;
}

export const CARProblemDescContext = createContext<CARProblemDescContextType | undefined>(
  undefined
);

export const CARProblemDescContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const lacc_phase = "Look Across, Correct, Contain";
  const ca_phase = "Corrective Action (CA) Implementation";
  const [carProblemDesc, setCarProblemDesc] = useState<CARProblemDesc>({"lacc_phase": lacc_phase, "ca_phase": ca_phase}); 
  return (
    <CARProblemDescContext.Provider value={{ carProblemDesc, setCarProblemDesc }}>
        {children}
    </CARProblemDescContext.Provider>
  );
};

// Custom hook to access the context
export const useCARProblemDescContext = (): CARProblemDescContextType => {
  const context = useContext(CARProblemDescContext);
  if (!context) {
      throw new Error('useCARProblemDescContext must be used within a Provider');
  }
  return context;
}