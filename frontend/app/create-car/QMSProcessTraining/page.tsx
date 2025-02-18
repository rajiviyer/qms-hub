"use client";
import React, { useEffect, useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { CARQPTReq } from '@/configs/schema';
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';



export default function QMSProcessTraining() {
    const carProblemDescContext = useContext(CARProblemDescContext);
    if (!carProblemDescContext) {
    throw new Error('carProblemDescContext is not available');
    }

    const { carProblemDesc, setCarProblemDesc,  } = carProblemDescContext;
    const car_number = carProblemDesc?.car_number;

    console.log(`car number: ${car_number}`);    

    const [ carQPTReq, setCarQPTReq ] = useState<CARQPTReq | null>(null);

    const { register, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            car_number: car_number || "",
            qms_required: "Yes",
            qms_required_comments: "",
            qms_documentation_required: "Yes",
            qms_documentation_required_comments: "",
            training_required: "Yes",
            training_required_comments: "",
        },
    })

    const url = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();    

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); 

    useEffect(() => {
        if (car_number) {
            fetch(`${url}/api/get_car_qpt_req/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({car_number: car_number}),
            }).then(response => response.json())
            .then(data => {
                if (data) {
                    reset(data);
                    console.log(`carQPTReq from API: ${JSON.stringify(data)}`);
                }
            }).catch(error => {
                console.error('Error fetching car qpt req data:', error);
            });
        }
    }, [car_number, reset]);

    // console.log(`carQPTReq: ${JSON.stringify(carQPTReq)}`);    


    const submitCARQPTReq = async (data: CARQPTReq) => {
        try {
            console.log(`CARQPTReq: ${JSON.stringify(data)}`);

            const response = await fetch(`${url}/api/add_car_qpt_req`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseMessage = await response.json();
                
                if (/success/i.test(responseMessage)) {
                    setMessageType('success');
                    setMessage(responseMessage);
                    router?.push('/create-car/CAEffectivenessPlan');
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

    const handlePrevious = () => {
        router.push("CorrectiveActionPlan");
    };     

  return (
    <div>
        {message && (
                    <p className="text-center" style={{ color: messageType === 'error' ? 'red' : 'green' }}>
                    {message}
                    </p>
        )}
        <form onSubmit={handleSubmit(submitCARQPTReq)}>
            <div className="px-10 md:px-20 lg:px-44">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 my-4">
                        <h3 className="text-2xl text-teal-900 font-medium text-center">Update QMS Process Risks & Opportunities</h3>
                    </div>                    
                    <div>
                        <label className="text-sm font-bold">📑Required</label>
                        <Select 
                            onValueChange={(value) => setValue("qms_required", value)}
                            defaultValue={watch("qms_required") || "Yes"}
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
                    <div>
                        <label className="text-sm font-bold">⚡Comments</label>
                        <Input
                            type="text"
                            className="text-xl"
                            placeholder="Enter Comments"
                            {...register("qms_required_comments", { required: true})}
                        />
                    </div>
                    <div className="col-span-2 my-4">
                        <h3 className="text-2xl text-teal-900 font-medium text-center">Update QMS Documentation</h3>
                    </div>                    
                    <div>
                        <label className="text-sm font-bold">📑Required</label>
                        <Select 
                            onValueChange={(value) => setValue("qms_documentation_required", value)}
                            defaultValue={watch("qms_documentation_required") || "Yes"}
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
                    <div>
                        <label className="text-sm font-bold">⚡Comments</label>
                        <Input
                            type="text"
                            className="text-xl"
                            placeholder="Enter Comments"
                            {...register("qms_documentation_required_comments", { required: true})}
                        />
                    </div>
                    <div className="col-span-2 my-4">
                        <h3 className="text-2xl text-teal-900 font-medium text-center">Personnel Training Needs</h3>
                    </div>                    
                    <div>
                        <label className="text-sm font-bold">📑Required</label>
                        <Select 
                            onValueChange={(value) => setValue("training_required", value)}
                            defaultValue={watch("training_required") || "Yes"}
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
                    <div>
                        <label className="text-sm font-bold">⚡Comments</label>
                        <Input
                            type="text"
                            className="text-xl"
                            placeholder="Enter Comments"
                            {...register("training_required_comments", { required: true})}
                        />
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
