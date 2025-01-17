"use client";
import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { CARProblemDesc } from '@/configs/schema';
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';


export default function ProblemDescription()
    {     
      
        const carProblemDescContext = useContext(CARProblemDescContext);
        if (!carProblemDescContext) {
        throw new Error('carProblemDescContext is not available');
        }
        const defaultSource = "CCN";
        const { carProblemDesc, setCarProblemDesc } = carProblemDescContext;

        // const formatDate = (date?: Date | string): string => {
        //     if (!date) return ""; // Return an empty string if the date is undefined
        
        //     // If the input is a string, attempt to parse it as a Date
        //     const parsedDate = typeof date === "string" ? new Date(date) : date;
        
        //     // Validate that the parsedDate is a valid Date object
        //     if (isNaN(parsedDate.getTime())) {
        //         console.error("Invalid date provided:", date);
        //         return ""; // Return an empty string if the date is invalid
        //     }
        
        //     const year = parsedDate.getFullYear();
        //     const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        //     const day = String(parsedDate.getDate()).padStart(2, "0");
        //     return `${year}-${month}-${day}`;
        // };        

        const defaultCARProblemDesc: CARProblemDesc = {
            car_number: carProblemDesc?.car_number,
            initiation_date: carProblemDesc?.initiation_date,
            initiator: carProblemDesc?.initiator,
            recipient: carProblemDesc?.recipient,
            coordinator: carProblemDesc?.coordinator,
            source: carProblemDesc?.source??defaultSource,
            description: carProblemDesc?.description,
            lacc_phase: carProblemDesc?.lacc_phase,
            lacc_responsibility: carProblemDesc?.lacc_responsibility,
            lacc_target_date: carProblemDesc?.lacc_target_date,
            ca_phase: carProblemDesc?.ca_phase,
            ca_responsibility: carProblemDesc?.ca_responsibility,
            ca_target_date: carProblemDesc?.ca_target_date
          };

        const {register, handleSubmit, setValue} = useForm<CARProblemDesc>({defaultValues: defaultCARProblemDesc});
        const url = process.env.NEXT_PUBLIC_API_URL;
        const router = useRouter();
        const [message, setMessage] = useState('');
        const [messageType, setMessageType] = useState('');

        const submitCARProblemDesc = async (data: CARProblemDesc) => {
            try {
                console.log(`carProblemDesc: ${JSON.stringify(data)}`);

                const response = await fetch(`${url}/api/add_car_problem_desc`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const responseMessage = await response.json();
                    // console.log(`Message: ${responseMessage}`);
                    
                    
                    if (/success/i.test(responseMessage)) {
                    setCarProblemDesc(data);
                    router?.push('/create-car/LookAcross');
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
     
        return (
            <div>
                <h3 className="text-2xl text-teal-900 font-medium text-center">
                    Problem Description
                </h3>
                <div className="px-10 md:px-20 lg:px-44">
                    {message && (
                    <p style={{ color: messageType === 'error' ? 'red' : 'green' }}>
                    {message}
                    </p>
                    )}   
                    <form className="w-full" onSubmit={handleSubmit(submitCARProblemDesc)}>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm font-bold">🎚️CAR #</label>
                                <Input
                                    type="text"
                                    className="text-xl"
                                    placeholder={"CAR Number"}
                                    {...register("car_number", { required: "Enter CAR Number"})}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold">🕘CAR Initiation Date</label>
                                <Input
                                    type="date"
                                    {...register("initiation_date", { required: true})}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold">🙋‍♂️Initiator</label>
                                <Input
                                    type="text"
                                    {...register("initiator", { required: true})}
                                    className="text-xl"
                                    placeholder={"Enter Initiator Name"}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold">🙋‍♂️Recipient</label>
                                <Input
                                    type="text"
                                    {...register("recipient", { required: true})}
                                    className="text-xl"
                                    placeholder={"Enter Recipient Name"}
                                />
                            </div>    
                            <div>
                                <label className="text-sm font-bold">🙋‍♂️Coordinator</label>
                                <Input
                                    type="text"
                                    {...register("coordinator", { required: true})}
                                    className="text-xl"
                                    placeholder={"Enter Coordinator Name"}
                                />
                            </div> 
                            <div>
                                <label className="text-sm font-bold">🧩CAR Source</label>
                                <Select
                                    onValueChange={(value) => setValue("source", value)}
                                >
                                    <SelectTrigger className="">
                                    <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="CCN">CCN</SelectItem>
                                    <SelectItem value="IA">IA</SelectItem>
                                    <SelectItem value="Supplier Audit">Supplier Audit</SelectItem>
                                    <SelectItem value="Customer Audit">Customer Audit</SelectItem>
                                    <SelectItem value="TPA">TPA</SelectItem>                        
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-bold">
                                    📝Problem Description (Include violating requirement & objective evidence)
                                </label>
                                <Textarea
                                    className="text-xl h-3"
                                    placeholder={"Enter Description"}
                                    {...register("description", { required: true})}
                                />
                            </div>
                            <div className="col-span-2">
                                <fieldset className="form-group border border-gray-600 p-4 rounded">
                                    <legend className="text-lg font-bold text-gray-700">
                                        CAR Phase
                                    </legend>
                                    <div>
                                        <table className="table-auto border-collapse border border-gray-300 w-full">
                                            <thead>
                                                <tr>
                                                    <th className="border border-gray-300 px-2 py-2 bg-gray-100 font-semibold text-blue">
                                                        Phase
                                                    </th>
                                                    <th className="border border-gray-300 px-2 py-2 bg-gray-100 font-semibold">
                                                        Responsibility
                                                    </th>
                                                    <th className="border border-gray-300 px-2 py-2 bg-gray-100 font-semibold">
                                                        Target Date
                                                    </th>                            
                                                </tr>
                                            </thead> 
                                            <tbody>
                                                <tr key={1} className="border border-gray-300">
                                                    <td className="text-center border border-gray-300">
                                                        <label className="text-sm font-bold">{carProblemDesc.lacc_phase}</label>
                                                    </td>
                                                    <td className="border border-gray-300">
                                                        <Input
                                                            type="text"
                                                            className="text-xl"
                                                            placeholder={"Enter Recipient Name"}
                                                            {...register("lacc_responsibility", { required: true})}
                                                        />           
                                                    </td>
                                                    <td className="border border-gray-300">
                                                        <Input
                                                            type="date"
                                                            {...register("lacc_target_date", { required: true})}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr key={2} className="border border-gray-300">
                                                    <td className="text-center border border-gray-300">
                                                        <label className="text-sm font-bold">{carProblemDesc.ca_phase}</label>
                                                    </td>
                                                    <td className="border border-gray-300">
                                                        <Input
                                                            type="text"
                                                            className="text-xl"
                                                            placeholder={"Enter Recipient Name"}
                                                            {...register("ca_responsibility", { required: true})}
                                                        />           
                                                    </td>
                                                    <td className="border border-gray-300">
                                                        <Input
                                                            type="date"
                                                            {...register("ca_target_date", { required: true})}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>                    
                            </div>
                        </div>
                        <div className="flex justify-between mt-10">
                          <Button
                              disabled={true}
                              variant="outline"
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
            </div>
        )
    }