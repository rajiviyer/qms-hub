"use client";
import React, { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ValidateCANeed() {
  const [values, setValues] = useState({
    ca_needed: "No",
    occurrence: 0,
    severity: 0,
    rpn: 0,
    ca_required: "No",
  });

  useEffect(() => {
    console.log(`values: ${JSON.stringify(values)}`);
  }, [values]);

  // Handle input changes and update state
  const handleInputChange = (key: string, value: string | number) => {
    const updatedValues = { ...values, [key]: value };

    // Update RPN whenever occurrence or severity changes
    if (key === "occurrence" || key === "severity") {
      updatedValues.rpn = updatedValues.occurrence * updatedValues.severity;
    }

    // Apply logic to update CA Required
    if (key === "ca_needed" && value === "Yes") {
      updatedValues.ca_required = "Yes";
    } else {
      updatedValues.ca_required =
        updatedValues.severity > 8 || updatedValues.rpn > 30 ? "Yes" : "No";
    }

    // console.log(`values: ${JSON.stringify(updatedValues)}`);
    
    setValues(updatedValues);
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
        <form action="">
            <div className="px-10 md:px-20 lg:px-44">
            <div className="grid grid-cols-2 gap-4">   
                <div>
                    <label className="text-sm font-bold">📑CA Required by Competent Authority (Ex. Management, Customer, Auditors)</label>
                    <Select
                        onValueChange={(value) => setValue("ca_required", value)}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Yes, Required by Management">Yes, Required by Management</SelectItem>
                            <SelectItem value="Yes, Required by Customer">Yes, Required by Management</SelectItem>
                            <SelectItem value="Yes, Required by Certification Body">Yes, Required by Management</SelectItem>
                            <SelectItem value="Yes, Required by Statutory/Regulatory Bodies">Yes, Required by Management</SelectItem>
                            <SelectItem value="Yes, Required by Others">Yes, Required by Management</SelectItem>
                            <SelectItem value="Not Required">Not Required</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-bold">⚡Required by</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder="Enter Required by Name"

                    />
                </div>
                <div>
                    <label className="text-sm font-bold">⚡Comment - If CA is required by Competent Authority, Risk Analysis optional</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder="Enter Comments"
                        
                    />
                </div>
                <div className="col-span-2 my-4">
                    <h2>Risk Analysis</h2>
                </div>
                <div>
                    <label className="text-sm font-bold">❗Severity</label>
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        className="text-xl"
                        placeholder="Enter Severity value (1-10)"
                        onChange={(event) =>
                        handleInputChange("severity", event.target.value)
                        }
                    />
                </div>                                  
                <div>
                    <label className="text-sm font-bold">❗Severity Number</label>
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        className="text-xl"
                        placeholder="Enter Severity value (1-10)"
                        onChange={(event) =>
                        handleInputChange("severity", event.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">⚡Occurrence During Last 12 Months</label>
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        className="text-xl"
                        placeholder="Enter Occurrence value (1-10)"
                        onChange={(event) =>
                        handleInputChange("occurrence", event.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">📏RPN (Risk Priority Number)</label>
                    <Input
                        type="number"
                        min={1}
                        max={100}
                        className="text-xl"
                        value={values.rpn}
                        readOnly
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">CA Required</label>
                    <Select value={values.ca_required} disabled>
                        <SelectTrigger>
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>             
        </div>    

        </form>  
       
    </div>
  )
}
