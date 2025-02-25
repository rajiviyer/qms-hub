"use client";
import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from "next/navigation";
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
import { UserContext } from "@/app/_context/UserContext";
import { UserEmail, User, CarLog } from "@/configs/schema";


export default function ProblemDescription()
    {     
      
        const userContext = useContext(UserContext);
        if (!userContext) {
            throw new Error('UserContext is not available');
        }
        const { user, updateUser } = userContext;
        console.log(`user in ProblemDescription: ${JSON.stringify(user)}`);
        

        const carProblemDescContext = useContext(CARProblemDescContext);
        if (!carProblemDescContext) {
        throw new Error('carProblemDescContext is not available');
        }
        const defaultSource = "CCN";
        const { carProblemDesc, setCarProblemDesc } = carProblemDescContext;

        console.log(`user org: ${user?.organization}`);
        

        const defaultCARProblemDesc: CARProblemDesc = {
            car_number: carProblemDesc?.car_number,
            initiation_date: carProblemDesc?.initiation_date,
            initiator: carProblemDesc?.initiator,
            recipient: carProblemDesc?.recipient,
            coordinator: carProblemDesc?.coordinator,
            source: carProblemDesc?.source??defaultSource,
            description: carProblemDesc?.description,
            user_org: user?.organization,
            lacc_phase: carProblemDesc?.lacc_phase,
            lacc_responsibility: carProblemDesc?.lacc_responsibility,
            lacc_target_date: carProblemDesc?.lacc_target_date,
            ca_phase: carProblemDesc?.ca_phase,
            ca_responsibility: carProblemDesc?.ca_responsibility,
            ca_target_date: carProblemDesc?.ca_target_date
          };

        console.log(`defaultCARProblemDesc: ${JSON.stringify(defaultCARProblemDesc)}`);
        

        const {register, handleSubmit, setValue, watch} = useForm<CARProblemDesc>({defaultValues: defaultCARProblemDesc});
        const searchParams = useSearchParams();
        const carNumberFromURL = searchParams.get('car_number');
        console.log(`carNumberFromURL: ${carNumberFromURL}`);
        
        const url = process.env.NEXT_PUBLIC_API_URL;
        const router = useRouter();
        const [message, setMessage] = useState('');
        const [messageType, setMessageType] = useState('');


        useEffect(() => {
            async function fetchData() {
                if (carNumberFromURL) {
                    console.log("In useEffect ProblemDescription");
                    
                    const response = await fetch(`${url}/api/get_car_problem_desc`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ car_number: carNumberFromURL }),
                    }).then(response => response.json())
                    .then(data => {
                        if (data) {
                            console.log(`CARProblemDesc: ${JSON.stringify(data)}`);
                            // setCarProblemDesc(data);
                            setValue('car_number', data.car_number);
                            setValue('initiation_date', data.initiation_date);
                            setValue('initiator', data.initiator);
                            setValue('recipient', data.recipient);
                            setValue('coordinator', data.coordinator);
                            setValue('source', data.source);
                            setValue('description', data.description);
                            setValue('user_org', data.user_org);
                            setValue('lacc_phase', data.lacc_phase);
                            setValue('lacc_responsibility', data.lacc_responsibility);
                            setValue('lacc_target_date', data.lacc_target_date);
                            setValue('ca_phase', data.ca_phase);
                            setValue('ca_responsibility', data.ca_responsibility);
                            setValue('ca_target_date', data.ca_target_date);
                        }
                        else {
                            setValue('car_number', carNumberFromURL);
                        }
                    });
                }
            }
        fetchData();
        }, [carNumberFromURL, setValue]);

        // console.log(`carProblemDesc: ${JSON.stringify(carProblemDesc)}`);
        console.log(`user org: ${user?.organization}`);

        const submitCARProblemDesc = async (data: CARProblemDesc) => {
            try {
                console.log(`carProblemDesc in submit: ${JSON.stringify({...data, "user_org": user?.organization})}`);

                const response = await fetch(`${url}/api/add_car_problem_desc`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({...data, "user_org": user?.organization}),
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
                                    defaultValue={watch("source") || defaultSource}
                                    value={watch("source") || defaultSource}
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
                            {/* <div className="col-span-2 hidden">{...register("user_org", {required: true})}</div> */}
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