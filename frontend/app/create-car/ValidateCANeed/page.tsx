"use client";
import React, { useEffect, useState, useContext } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { CARCANeed } from '@/configs/schema';
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';
// import { CARCANeedContext } from '@/app/_context/CARCANeedContext';

const severityOptions = [
    {
        "severity": "Product failure detected prior to customer shipment; can be accepted for intended application as-is with or without customer concession",
        "severity_number": 1
    },
    {
        "severity": "Product failure detected prior to customer shipment; product can be used for intented application with rework",
        "severity_number": 2
    },
    {
        "severity": "Product failure detected prior to customer shipment; product can be used for alternate application without rework",
        "severity_number": 3
    },
    {
        "severity": "Product failure detected prior to customer shipment; product can be used for alternate application, with rework",
        "severity_number": 4
    },
    {
        "severity": "Product failure detected prior to customer shipment; product unusable and must be scrapped",
        "severity_number": 5
    },
    {
        "severity": "Product failure at customer site; customer is able to use product and does not require any credit or replacement/rework",
        "severity_number": 6
    },
    {
        "severity": "Product failure at customer site makes partial shipment unusable.  Customer requires sorting and/or subsequent partial credit/replacement/rework at organization's cost",
        "severity_number": 7
    },
    {
        "severity": "Product failure at customer site makes 100% of shipment unusable.  Customer requires sorting and/or subsequent full credit/replacement/rework at organization's cost and/or threatened loss of business relationship with customer",
        "severity_number": 8
    },
    {
        "severity": "Product failure could result in violation of a statutory/regulatory requirement",
        "severity_number": 9
    },
    {
        "severity": "Product failure could cause personnel injury to organization's employee(s), customer(s) or end user(s)",    
        "severity_number": 10
    }
];

const occurrenceOptions = [
    {
        "occurrence": "This is first time occurrence of this failure type",
        "occurrence_number": 1
    },
    {
        "occurrence": "Not a single recurrence of this failure type experienced within the past five years",
        "occurrence_number": 2
    },    
    {
        "occurrence": "Not a single recurrence of this failure type experienced within the past three years",
        "occurrence_number": 3
    },
    {
        "occurrence": "Not a single recurrence of this failure type experienced within the past two years",
        "occurrence_number": 4
    },
    {
        "occurrence": "Not a single recurrence of this failure type experienced within the past 12 months",
        "occurrence_number": 5
    },
    {
        "occurrence": "An average of at least one failure of this type has occurred within the past 12 months",
        "occurrence_number": 6
    },
    {
        "occurrence": "An average of at least one failure of this type has occurred per quarter for the past 12 months",
        "occurrence_number": 7
    },
    {
        "occurrence": "An average of at least one failure of this type has occurred per month for the past 12 months",
        "occurrence_number": 8
    },
    {
        "occurrence": "Failure of this type is a weekly expected norm at least for the past one month",
        "occurrence_number": 9
    },
    {
        "occurrence": "Failure of this type is a daily expected norm at this time",
        "occurrence_number": 10
    }
];

const caRequiredOptions = [
    "Yes, Required by Management",
    "Yes, Required by Customer",
    "Yes, Required by Certification Body",
    "Yes, Required by Statutory/Regulatory Bodies",
    "Yes, Required by Others",
    "Not Required"    
]

export default function ValidateCANeed() {
   
    const carProblemDescContext = useContext(CARProblemDescContext);
    if (!carProblemDescContext) {
    throw new Error('carProblemDescContext is not available');
    }

    const { carProblemDesc, setCarProblemDesc,  } = carProblemDescContext;
    const car_number = carProblemDesc?.car_number;

    const [ carCANeed, setCarCANeed ] = useState<CARCANeed | null>(null);
    const { register, handleSubmit, setValue, watch, reset } = useForm<CARCANeed>({
        defaultValues: {
            car_number: car_number || "",
            ca_required: caRequiredOptions[0],
            required_by: "",
            comment: "",
            severity: severityOptions[0].severity_number, // First severity option
            occurrence: occurrenceOptions[0].occurrence_number, // First occurrence option
            rpn: severityOptions[0].severity_number * occurrenceOptions[0].occurrence_number,
            ca_needed: "Yes",
          },        
    });    

    const url = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();    

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');    

    useEffect(() => {
        // const car_number = carProblemDesc?.car_number;
        if (car_number) {
            fetch(`${url}/api/get_car_ca_need/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({car_number: car_number}),
            }).then(response => response.json())
            .then(data => {
                if (data) {
                    reset(data);
                    console.log(`carCANeed from API: ${JSON.stringify(data)}`);
                }
            }).catch(error => {
                console.error('Error fetching car need data:', error);
            });
        }
    }, [car_number, reset]);

    console.log(`carCANeed: ${JSON.stringify(carCANeed)}`);
    

    useEffect(() => {
        const severity = watch("severity") || severityOptions[0].severity_number;
        const occurrence = watch("occurrence") || occurrenceOptions[0].occurrence_number;
        setValue("rpn", severity * occurrence);
      }, [watch("severity"), watch("occurrence"), setValue]);    
   
    const submitCARCANeed = async (data: CARCANeed) => {
        try {
            console.log(`carCANeed: ${JSON.stringify(data)}`);

            const response = await fetch(`${url}/api/add_car_ca_need`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseMessage = await response.json();
                // console.log(`Message: ${responseMessage}`);
                
                
                if (/success/i.test(responseMessage)) {
                // setCarCANeed(data);
                    setMessageType('success');
                    setMessage(responseMessage);
                    router?.push('/create-car/DefineRCAType');
                }
                else {
                    setMessageType('error');
                    setMessage(responseMessage);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessageType('error');
            setMessage('An error occurred. Please try again.');
        }
    }    

    console.log(`watch ca_required: ${watch("ca_required")}`);
    
    const handlePrevious = () => {
        router.push("LookAcross");
    };   

  return (
    <div>
        <h3 className="text-2xl text-teal-900 font-medium text-center">
            Corrective Action
        </h3>
        {message && (
                    <p className="text-center" style={{ color: messageType === 'error' ? 'red' : 'green' }}>
                    {message}
                    </p>
        )}
        <form onSubmit={handleSubmit(submitCARCANeed)}>
            <div className="px-10 md:px-20 lg:px-44">
                <div className="grid grid-cols-2 gap-4">   
                    <div>
                        <label className="text-sm font-bold">📑CA Required by Competent Authority (Ex. Management, Customer, Auditors)</label>
                        <Select
                            onValueChange={(value) => setValue("ca_required", value)}
                            defaultValue={watch("ca_required") || caRequiredOptions[0]}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {caRequiredOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-bold">⚡Required by</label>
                        <Input
                            type="text"
                            className="text-xl"
                            placeholder="Enter Required by Name"
                            {...register("required_by", { required: true})}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-bold">⚡Comment - If CA is required by Competent Authority, Risk Analysis optional</label>
                        <Input
                            type="text"
                            className="text-xl"
                            placeholder="Enter Comments"
                            {...register("comment", { required: true})}
                        />
                    </div>
                    <div className="col-span-2 my-4">
                        <h3 className="text-2xl text-teal-900 font-medium text-center">Risk Analysis</h3>
                    </div>
                    <div>   
                        <label className="text-sm font-bold">❗Severity</label>
                        <Select
                            onValueChange={(value) => setValue("severity", parseInt(value))}
                            defaultValue={(watch("severity") ?? severityOptions[0].severity_number).toString()}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {severityOptions.map((option) => (
                                    <SelectItem key={option.severity_number} value={option.severity_number.toString()}>
                                        {option.severity}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>                                  
                    <div>
                        <label className="text-sm font-bold">❗Severity Number</label>
                        <Input
                            type="number"
                            min={1}
                            max={10}
                            className="text-xl"
                            // value={watch("severity").toString()}
                            readOnly
                            {...register("severity", { required: true})}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold">⚡Occurrence During Last 12 Months</label>
                        <Select
                            onValueChange={(value) => setValue("occurrence", parseInt(value))}
                            defaultValue={(watch("occurrence") ?? occurrenceOptions[0].occurrence_number).toString()}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {occurrenceOptions.map((option) => (
                                    <SelectItem key={option.occurrence_number} value={option.occurrence_number.toString()}>
                                        {option.occurrence}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-bold">❗Occurrence Number</label>
                        <Input
                            type="number"
                            min={1}
                            max={10}
                            className="text-xl"
                            readOnly
                            {...register("occurrence", { required: true})}
                        />
                    </div>                
                    <div>
                        <label className="text-sm font-bold">📏RPN (Risk Priority Number)</label>
                        <Input
                            type="number"
                            min={1}
                            max={100}
                            className="text-xl"
                            value={(watch("occurrence") * watch("severity")).toString()}
                            readOnly
                            {...register("rpn", { required: true})}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold">CA Needed</label>
                        <Select 
                            onValueChange={(value) => setValue("ca_needed", value)}
                            defaultValue={watch("ca_needed") || "Yes"}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                            type="submit"
                        >
                            Next
                        </Button>
            </div>        
        </form>  
    </div>
  )
}