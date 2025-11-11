"use client";
import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
import { CARCANeed } from "@/configs/schema";

interface CARCANeedContextType {
    carCANeed: CARCANeed;
    setCarCANeed: React.Dispatch<React.SetStateAction<CARCANeed>>;
}

export const CARCANeedContext = createContext<CARCANeedContextType | undefined>(
  undefined
);

export const CARCANeedContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [carCANeed, setCarCANeed] = useState<CARCANeed>(
    {"car_number": 0, "ca_required": "", "required_by": "", "comment":"", "severity": 1, "occurrence": 1, "rpn": 1, "ca_needed": ""}
); 
  return (
    <CARCANeedContext.Provider value={{ carCANeed, setCarCANeed }}>
        {children}
    </CARCANeedContext.Provider>
  );
};

// Custom hook to access the context
export const useCARCANeedContext = (): CARCANeedContextType => {
  const context = useContext(CARCANeedContext);
  if (!context) {
      throw new Error('CARCANeedContext must be used within a Provider');
  }
  return context;
}