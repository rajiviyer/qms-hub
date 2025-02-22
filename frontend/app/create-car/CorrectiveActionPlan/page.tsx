"use client";
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import { CARProblemDesc, CARRootCause } from '@/configs/schema';
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';

const RCAPages: Record<string, string> = {
  "Immediate Cause Only": "", 
  "Simple Root Cause": "/create-car/SimpleRootCauseAnalysis",
  "Fish Bone Analysis": "/create-car/FishBoneAnalysis",
}

export default function CorrectiveActionPlan() {
    const [ carRootCauses, setCARRootCauses ] = useState<CARRootCause[]>([]);    
    const [gridData, setGridData] = useState<Record<string, 
            Array<{ corrective_action: string; responsibility: string; target_date: string; actual_date: string; status: string }>>>(
        {}
    );

    const carProblemDescContext = useContext(CARProblemDescContext);
    if (!carProblemDescContext) {
    throw new Error('carProblemDescContext is not available');
    }

    const { carProblemDesc, setCarProblemDesc,  } = carProblemDescContext;
    const car_number = carProblemDesc?.car_number;
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');      
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();    

    useEffect(() => {
        if (car_number) {
          fetch(`${API_URL}/api/get_car_rootcauses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ car_number: car_number }),
          })
            .then(response => response.json())
            .then(data => {
              if (data) {
                console.log(`Root Causes in CorrectiveActionPlan Page: ${JSON.stringify(data)}`);
                const extractedRootCauses = data.map((item: { root_cause: string }) => item.root_cause);
                setCARRootCauses(data);
                const initialGridData = extractedRootCauses.reduce((acc: any, rootCause: string) => {
                  acc[rootCause] = [{
                    corrective_action: "",
                    responsibility: "",
                    target_date: "",
                    actual_date: "",
                    status: "",
                  }];
                  return acc;
                }, {});
                setGridData(initialGridData);
              }
            })
            .catch(error => console.error('Error fetching root causes:', error));
        }
      }, [car_number]);
      
    const handlePrevious = () => {
      const response = fetch(`${API_URL}/api/get_car_rca_type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"car_number": car_number}),
      }).then(response => response.json())
      .then(data => {
        if (data) {
            console.log(`RCAType in CorrectiveActionPlan Page: ${JSON.stringify(data)}`);
            router?.push(RCAPages[data?.rca_type])
        }
      }).catch(error => {
        console.error('Error in fetching rca type data', error);
      });       
    }

    const handleInputChange = (rootCause: string, rowIndex: number, field: keyof (typeof gridData)[string][number], value: string) => {
        setGridData(prevGridData => {
          const updatedRows = [...(prevGridData[rootCause] || [])]; // Ensure it's an array
          if (!updatedRows[rowIndex]) {
            updatedRows[rowIndex] = { corrective_action: "", responsibility: "", target_date: "", actual_date: "", status: "" };
          }
          updatedRows[rowIndex][field] = value;
          return { ...prevGridData, [rootCause]: updatedRows };
        });
      };
      
      const addRow = (rootCause: string) => {
        setGridData(prevGridData => {
          const updatedRows = [...(prevGridData[rootCause] || [])]; // Ensure it's an array
          updatedRows.push({ corrective_action: "", responsibility: "", target_date: "", actual_date: "", status: "" });
          return { ...prevGridData, [rootCause]: updatedRows };
        });
      };
      
      const removeRow = (rootCause: string, rowIndex: number) => {
        setGridData(prevGridData => {
          if (!prevGridData[rootCause] || prevGridData[rootCause].length <= 1) return prevGridData;
          const updatedRows = prevGridData[rootCause].filter((_, index) => index !== rowIndex);
          return { ...prevGridData, [rootCause]: updatedRows };
        });
      };

      const validateData = () => {
        for (const item of carRootCauses) {
          for (const row of gridData[item.root_cause] || []) {
            if (!row.corrective_action || !row.responsibility || !row.target_date || !row.status) {
              setMessageType("error");
              setMessage("All fields except Actual Date must be filled before saving.");
              return false;
            }
          }
        }
        setMessage("");
        return true;
      };      
    
      const saveData = async () => {
        if (!validateData()) {
            setMessage("All mandatory fields must be filled before saving.");
            setMessageType("error");
        }
        else {
            try {
            const formattedData = Object.entries(gridData).flatMap(([rootCause, rows]) =>
                rows.map(row => ({ car_number: car_number, root_cause: rootCause, ...row }))
            );

            console.log(`Grid Data before adding to DB: ${JSON.stringify(formattedData)}`);
            
            
            const response = await fetch(`${API_URL}/api/add_car_cap_data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries: formattedData }),
            });
            
            if (response.ok) {
                const responseMessage = await response.json();
                if (/success/i.test(responseMessage)) {
                setMessageType('success');
                setMessage("Successfully Added Data");
                router?.push("/create-car/QMSProcessTraining");
                } 
                else {
                setMessageType('error');
                setMessage(responseMessage);
                }
            }
            } catch (error) {
            console.error('Error saving data:', error);
            setMessageType('error');
            setMessage('An error occurred. Please try again.');
            }
        }
      };    


    return (
        <div className="p-6 space-y-6">
          {message && <p className={`text-center ${messageType === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          {carRootCauses.map((option: CARRootCause, index: number) => (
            <div key={option.root_cause} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-2">Root Cause: {option.root_cause}</h2>
              <Button onClick={() => addRow(option.root_cause)} className="mb-4">Add Row</Button>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 bg-gray-100">Corrective Action</th>
                    <th className="border border-gray-300 px-2 py-2 bg-gray-100">Responsibility</th>
                    <th className="border border-gray-300 px-2 py-2 bg-gray-100">Target Date</th>
                    <th className="border border-gray-300 px-2 py-2 bg-gray-100">Actual Date</th>
                    <th className="border border-gray-300 px-2 py-2 bg-gray-100">Status</th>
                    <th className="border border-gray-300 px-2 py-2 bg-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData[option.root_cause]?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td><Textarea value={row.corrective_action} onChange={(e) => handleInputChange(option.root_cause, rowIndex, "corrective_action", e.target.value)} /></td>
                      <td><Textarea value={row.responsibility} onChange={(e) => handleInputChange(option.root_cause, rowIndex, "responsibility", e.target.value)} /></td>
                      <td><Input type="date" value={row.target_date} onChange={(e) => handleInputChange(option.root_cause, rowIndex, "target_date", e.target.value)} /></td>
                      <td><Input type="date" value={row.actual_date} onChange={(e) => handleInputChange(option.root_cause, rowIndex, "actual_date", e.target.value)} /></td>
                      <td><Textarea value={row.status} onChange={(e) => handleInputChange(option.root_cause, rowIndex, "status", e.target.value)} /></td>
                      <td>{rowIndex > 0 && <Button onClick={() => removeRow(option.root_cause, rowIndex)} className="bg-red-500 text-white">X</Button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <div className="flex justify-between mt-10">
            <Button
                className="text-primary"
                onClick={handlePrevious}
            >
                Previous
            </Button>
            <Button
                className="text-primary"
                onClick={saveData}
            >
                Next
            </Button>
          </div>  
      </div>
    )
}