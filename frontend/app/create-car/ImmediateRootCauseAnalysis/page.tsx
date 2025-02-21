"use client";
import React, { useState, useContext, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CARProblemDescContext } from "@/app/_context/CARProblemDescContext";
import { useRouter } from "next/navigation";
import { CarImmediateRCA } from '@/configs/schema';

export default function ImmediateRootCauseAnalysis() {
  const carProblemDescContext = useContext(CARProblemDescContext);
  if (!carProblemDescContext) {
    throw new Error("CARProblemDescContext is not available");
  }

  const { carProblemDesc } = carProblemDescContext;
  const car_number = carProblemDesc?.car_number;

  console.log(`In Simple Root Cause page, car number: ${car_number}`);

const [ carImmediateRCA, setCarImmediateRCA ] = useState<CarImmediateRCA | null>({
    car_number: car_number || "",
    root_cause: ""});  

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');  

  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

  // Fetch existing simple root cause from backend when page loads
  useEffect(() => {
      if (car_number) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get_car_immediate_root_cause_analysis/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({car_number: car_number}),
        }).then(response => response.json())
        .then(data => {
          console.log(`immediate_root_cause_analysis data: ${JSON.stringify(data)}`);
          if (data) {
            setCarImmediateRCA(data);
          }
        }).catch(error => {
          console.error("Error fetching immediate root cause data:", error);
        });
      }
  }, [car_number]);

  const changeImmediateRCA = (value: string) => {
    if (carImmediateRCA) {
        setCarImmediateRCA({...carImmediateRCA, root_cause: value});
    }
}
const handleNext = async () => {
    try{
        const response = await fetch(`${API_URL}/api/add_car_immediate_root_cause_analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carImmediateRCA),
        });

        if (response.ok) {
            const responseMessage = await response.json();
               
            if (/success/i.test(responseMessage)) {
                setMessageType('success');
                setMessage(responseMessage);
                router?.push('/create-car/CorrectiveActionPlan');    
            }
            else {
                setMessageType('error');
                setMessage(responseMessage);
            }
        }
    }
    catch (error) {
        console.error('Error:', error);
        setMessageType('error');
        setMessage('An error occurred. Please try again.');
    }
};

  const handlePrevious = () => {
    router.push("DefineRCAType");
  };    

  return (
    <div className="p-4 space-y-4">
        <h3 className="text-2xl text-teal-900 font-medium text-center">
            Immediate Root Cause Analysis
        </h3>
        {message && (
            <p className="text-center" style={{ color: messageType === 'error' ? 'red' : 'green' }}>
            {message}
            </p>
        )}
        <div className="px-10 md:px-20 lg:px-44 mt-3">   
            <div className="px-20 md:px-40 lg:px-64">
                <label className="text-sm font-bold">📑Immediate Root Cause</label>
                <Textarea
                    className="text-xl"
                    placeholder={"Enter Root Cause"}
                    value={carImmediateRCA?.root_cause}
                    onChange={(event) => changeImmediateRCA(event.target.value)}
                />
            </div>
        </div>
        <div className="flex justify-between mt-10">
            <Button
                className="text-primary"
                onClick={handlePrevious}
            >
                Previous
            </Button>
            <Button
                className="text-primary"
                onClick={handleNext}
            >
                Next
            </Button>
        </div>        
    </div>
  );
}
