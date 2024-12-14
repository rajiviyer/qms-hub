"use client";
import React, { useState, useEffect, useContext } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
// import { CARProblemDesc } from '@/configs/schema';
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';

export default function ProblemDescription(
    {
        registerSubmitHandler,
        currentPageIndex}: 
    {
        registerSubmitHandler: (handler: () => Promise<boolean>, index: number) => void;
        currentPageIndex: number;
    }
    ) 
    {
    const carProblemDescContext = useContext(CARProblemDescContext);
    if (!carProblemDescContext) {
      throw new Error('carProblemDescContext is not available');
    }
    // const [ carProblemDesc, setCarProblemDesc ] = carProblemDescContext;
    const { carProblemDesc, updateCARProblemDesc, submitCARProblemDesc } = carProblemDescContext;

    useEffect(() => {
        registerSubmitHandler(()=>submitCARProblemDesc(), 0); // Register handler for page index 0
    }, []);

    // const lacc_phase = "Look Across, Correct, Contain";
    // const ca_phase = "Corrective Action (CA) Implementation";
    // const [CARProblemDescInput, setCARProblemDescInput] = useState<CARProblemDesc>({});
    // const [CARPlanningPhaseInput, setCARPlanningPhaseInput] = useState<CARPlanningPhase>(
    //     {"lacc_phase": lacc_phase, "ca_phase": ca_phase}
    // );
    const handleInputChange = (fieldName: string, value: string) => {
        updateCARProblemDesc(fieldName as keyof typeof carProblemDesc, value);
        // setCarProblemDesc((prev) => {
        //     return {
        //         ...prev,
        //         [fieldName]: value,
        //     };
        // });
        console.log(`carProblemDesc: ${JSON.stringify(carProblemDesc)}`);
        console.log(`car_number: ${carProblemDesc?.car_number}`);
        
    };
  return (
    <div>
        <div className="px-10 md:px-20 lg:px-44">        
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-sm font-bold">🎚️CAR #</label>
                    <Input
                        type="text"
                        defaultValue={carProblemDesc?.car_number}
                        className="text-xl"
                        placeholder={"Enter CAR Number"}
                        onChange={(event) =>
                        handleInputChange("car_number", event.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">🕘CAR Initiation Date</label>
                    <Input
                        type="date"
                        onChange={(event) =>
                        handleInputChange("initiation_date", event.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">🙋‍♂️Initiator</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder={"Enter Initiator Name"}
                        onChange={(event) =>
                        handleInputChange("initiator", event.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">🙋‍♂️Recipient</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder={"Enter Recipient Name"}
                        onChange={(event) =>
                        handleInputChange("recipient", event.target.value)
                        }
                    />
                </div>    
                <div>
                    <label className="text-sm font-bold">🙋‍♂️Coordinator</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder={"Enter Coordinator Name"}
                        onChange={(event) =>
                        handleInputChange("coordinator", event.target.value)
                        }
                    />
                </div> 
                <div>
                    <label className="text-sm font-bold">🧩CAR Source</label>
                    <Select
                        onValueChange={(value) => handleInputChange("source", value)}
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
                        onChange={(event) =>
                        handleInputChange("description", event.target.value)
                        }
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
                                                onChange={(event) =>
                                                handleInputChange("lacc_responsibility", event.target.value)
                                                }
                                            />           
                                        </td>
                                        <td className="border border-gray-300">
                                            <Input
                                                type="date"
                                                onChange={(event) =>
                                                handleInputChange("lacc_target_date", event.target.value)
                                                }
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
                                                onChange={(event) =>
                                                handleInputChange("ca_responsibility", event.target.value)
                                                }
                                            />           
                                        </td>
                                        <td className="border border-gray-300">
                                            <Input
                                                type="date"
                                                onChange={(event) =>
                                                handleInputChange("ca_target_date", event.target.value)
                                                }
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </fieldset>                    
                </div>
            </div>
        </div>            
    </div>
  )
}
