"use client";
import React, { useEffect, useState, useContext } from 'react';
import { CARProblemDesc } from '@/configs/schema';
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';
import { useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const RCAPages: Record<string, string> = {
    "Immediate Cause Only": "", 
    "Simple Root Cause": "",
    "Fish Bone Analysis": "/create-car/FishBoneAnalysis",
}

export default function DefineRCAType() {

    const [ rcaType, setRCAType ] = useState<string>("");

    const carProblemDescContext = useContext(CARProblemDescContext);
    if (!carProblemDescContext) {
    throw new Error('carProblemDescContext is not available');
    }

    const { carProblemDesc, setCarProblemDesc,  } = carProblemDescContext;
    const car_number = carProblemDesc?.car_number;

    console.log(`car number: ${car_number}`);

    const url = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handlePrevious = () => {
        router.push("ValidateCANeed");
    };

    const handleNext = async () => {
        try{

            const data = {
                car_number: car_number,
                rca_type: rcaType
            }

            const response = await fetch(`${url}/api/add_car_rca_type`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseMessage = await response.json();
                // console.log(`Message: ${responseMessage}`);
                   
                if (/success/i.test(responseMessage)) {
                setMessageType('success');
                setMessage(responseMessage);
                router?.push(RCAPages[rcaType]);
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

    const rcaTypeOptions = [
        "Immediate Cause Only",
        "Simple Root Cause",
        "Fish Bone Analysis"
    ]

    const changeRCAType = (value: string) => {
        setRCAType(value);
    }

    return (
        <div>
            <h3 className="text-2xl text-teal-900 font-medium text-center">
                Root Cause Analysis Type
            </h3>
            <div className="px-10 md:px-20 lg:px-44">   
                <div className="px-20 md:px-40 lg:px-64">
                    <label className="text-sm font-bold">📑Select RCA Type</label>
                    <Select
                        onValueChange={(value) => changeRCAType(value)}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {rcaTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
    )
}
