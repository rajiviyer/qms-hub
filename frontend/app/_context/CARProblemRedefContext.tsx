"use client";
import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
import { CARProblemRedef } from "@/configs/schema";

interface CARProblemRedefContextType {
    carProblemRedef: CARProblemRedef;
    setCarProblemRedef: React.Dispatch<React.SetStateAction<CARProblemRedef>>;
}

export const CARProblemRedefContext = createContext<CARProblemRedefContextType | undefined>(
  undefined
);

export const CARProblemRedefContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [carProblemRedef, setCarProblemRedef] = useState<CARProblemRedef>(
    {"car_number": 0, "redefined_problem": "", "correction": "", "containment": "", "corr_cont_date": new Date()}
); 
  return (
    <CARProblemRedefContext.Provider value={{ carProblemRedef, setCarProblemRedef }}>
        {children}
    </CARProblemRedefContext.Provider>
  );
};

// Custom hook to access the context
export const useCARProblemRedefContext = (): CARProblemRedefContextType => {
  const context = useContext(CARProblemRedefContext);
  if (!context) {
      throw new Error('useCARProblemRedefContext must be used within a Provider');
  }
  return context;
}