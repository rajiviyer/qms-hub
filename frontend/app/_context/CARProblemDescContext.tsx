"use client";
import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
// import { CARProblemDescContextType } from "@/lib/type";
import { CARProblemDesc } from "@/configs/schema";

interface CARProblemDescContextType {
  carProblemDesc: CARProblemDesc;
  updateCARProblemDesc: (key: keyof CARProblemDesc, value: string) => void;
  resetCARProblemDesc: () => void;
  submitCARProblemDesc: () => Promise<boolean>;
}

export const CARProblemDescContext = createContext<CARProblemDescContextType | undefined>(
  undefined
);

export const CARProblemDescContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const lacc_phase = "Look Across, Correct, Contain";
  const ca_phase = "Corrective Action (CA) Implementation";
  const [carProblemDesc, setCarProblemDesc] = useState<CARProblemDesc>({"lacc_phase": lacc_phase, "ca_phase": ca_phase}); 
  const carProblemDescRef = useRef(carProblemDesc);

  // Update a specific field in the Form
  const updateCARProblemDesc = (key: keyof CARProblemDesc, value: string) => {
    setCarProblemDesc((prev) => {
      const updated = { ...prev, [key]: value };
      carProblemDescRef.current = updated;
      return updated;
    }); 
  };

  // Reset the form data
  const resetCARProblemDesc = () => {
    const initialCarProblemDesc = {"lacc_phase": lacc_phase, "ca_phase": ca_phase}
    setCarProblemDesc(initialCarProblemDesc);
    carProblemDescRef.current = initialCarProblemDesc;
  };

  // const getCARProblemDesc = () => {
  //   return carProblemDesc;
  // };

  // Submit the form data to the backend
  const submitCARProblemDesc = async (): Promise<boolean> => {
    try {
        console.log(`carProblemDesc Latest: ${JSON.stringify(carProblemDescRef.current)}`);

        const response = await fetch(`${url}/api/add_car_problem_desc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carProblemDescRef.current),
        });
        if (response.ok) {
            console.log('CARProblemDesc Form data submitted successfully');
            return true;
        } else {
            console.error('Failed to submit CARProblemDesc data');
            return false;
        }
    } catch (error) {
        console.error('Error submitting CARProblemDesc data:', error);
        return false;
    }
  };
  return (
    <CARProblemDescContext.Provider value={{ carProblemDesc, updateCARProblemDesc, resetCARProblemDesc, submitCARProblemDesc }}>
        {children}
    </CARProblemDescContext.Provider>
  );
};

// Custom hook to access the context
export const useCARProblemDescContext = (): CARProblemDescContextType => {
  const context = useContext(CARProblemDescContext);
  if (!context) {
      throw new Error('useCARProblemDescContext must be used within a Form1Provider');
  }
  return context;
}