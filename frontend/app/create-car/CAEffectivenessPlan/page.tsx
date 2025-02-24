"use client";
import React, { useEffect, useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';


export default function CAEffectivenessPlan() {
    const carProblemDescContext = useContext(CARProblemDescContext);
    if (!carProblemDescContext) {
    throw new Error('carProblemDescContext is not available');
    }

    const { carProblemDesc, setCarProblemDesc,  } = carProblemDescContext;
    const car_number = carProblemDesc?.car_number;

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');        
    const url = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();     

    const [rowHeaders, setRowHeaders] = useState([
        "ROW1",
    ]);
    const [columnHeaders, setColumnHeaders] = useState([
        "Planned Action",
        "Responsibility",
        "Target Date",
        "Actual Date",
        "Status",
    ]);

    const [gridData, setGridData] = useState(
        Array(rowHeaders.length)
        .fill(null)
        .map(() => Array(columnHeaders.length).fill(""))
    );

    const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null); 

    useEffect(() => {
        if (car_number) {
            fetch(`${url}/api/get_car_ca_effectiveness_plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({car_number: car_number}),
            }).then(response => response.json())
            .then(data => {
            console.log(`data: ${JSON.stringify(data)}`);
            console.log(`Array.isArray(data): ${Array.isArray(data)}`);
            console.log(`data.length: ${data.length}`);
            
            if (Array.isArray(data) && data.length > 0) {
                console.log("Inside if statement");
                
                // Create new grid with fetched data
                const newRowHeaders: string[] = Array.from(
                new Set(data.map((_, index) => index.toString()))
                );

                const newGrid: string[][] = data.map((item) => [
                item.planned_action,
                item.responsibility,
                item.target_date,
                item.actual_date,
                item.status,
                ]);
                
                console.log(`newGrid: ${JSON.stringify(newGrid)}`);
                
                setRowHeaders(newRowHeaders);
                setGridData(newGrid);
            }
            }).catch(error => {
            console.error("Error fetching CAR CAP data:", error);
            });
        }
    }, [car_number]);  

    
    const handlePrevious = () => {
        router?.push('QMSProcessTraining');
    }    

    const handleInputChange = (row: number, col: number, value: string) => {
        setMessage("");
        setMessageType("");
        const updatedData = [...gridData];
        updatedData[row][col] = value;
        setGridData(updatedData);
    };
    
    // Add a Row
    const addRow = () => {
    const newRowHeaders = [...rowHeaders, `NEW ROW ${rowHeaders.length + 1}`];
    setRowHeaders(newRowHeaders);
    setGridData([...gridData, Array(columnHeaders.length).fill("")]);
    };


    // Remove a Row
    const removeRow = (index: number) => {
    if (rowHeaders.length <= 1) return; // Ensure at least one row remains
    const newRowHeaders = rowHeaders.filter((_, i) => i !== index);
    const newGrid = gridData.filter((_, i) => i !== index);
    setRowHeaders(newRowHeaders);
    setGridData(newGrid);
    };  

    const validateGridData = () => {
    for (let row = 0; row < gridData.length; row++) {
        for (let col = 0; col < gridData[row].length; col++) {
        if (col != 3 && !gridData[row][col].trim()) {
            // setMessage("All fields must be filled before saving.");
            // setMessageType("error");
            return false;
        }
        }
    }
    setMessage("");
    return true;
    };  

    const convertGridToObjects = (gridData: string[][], columnHeaders: string[], car_number: string) => {
    return gridData.map((row) => {
        const formattedRow = Object.fromEntries(
        columnHeaders.map((col, index) => [
            col.toLowerCase().replace(/\s+/g, "_"), // ✅ Convert column names
            row[index]
        ])
        );
    
        // ✅ Automatically detect if "target_date" is present in headers and format it
        if (formattedRow["target_date"]) { 
        formattedRow["target_date"] = new Date(formattedRow["target_date"])
            .toISOString()
            .split("T")[0]; // Converts to YYYY-MM-DD format
        }

        // ✅ Automatically detect if "actual_date" is present in headers and format it
        if (formattedRow["actual_date"]) {
        formattedRow["actual_date"] = new Date(formattedRow["actual_date"])
            .toISOString()
            .split("T")[0]; // Converts to YYYY-MM-DD format
        }
    
        return { car_number: car_number, ...formattedRow };
    });
    };
      
    const saveData = async () => {
    if (!validateGridData()) {
        setMessage("All fields must be filled before saving.");
        setMessageType("error");
    }
    else {
        if (car_number) {
        try {
            const formattedData = convertGridToObjects(gridData, columnHeaders, car_number);   
            console.log(`formattedData CA Effectiveness Plan: ${JSON.stringify(formattedData)}`);
                
            const response = await fetch(`${url}/api/add_car_ca_effectiveness_plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entries: formattedData }),
            })
            
            if (response.ok) {
            const responseMessage = await response.json();
            
            if (/success/i.test(responseMessage)) {
                setMessageType('success')
                setMessage("Successfully Added Data")
                // setCarProblemRedef(data);
                router?.push('/landing');
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
    }
    };
    

  return (
    <div className="p-4 space-y-4">
        <h3 className="text-2xl text-teal-900 font-medium text-center">
        CA Effectiveness Plan
        </h3>
        {message && (
            <p className="text-center" style={{ color: messageType === 'error' ? 'red' : 'green' }}>
            {message}
            </p>
        )}
        <div className="flex space-x-4 mb-4 mt-3">
            <Button onClick={addRow}>Add Row</Button>
        </div>
        <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
                <tr>
                    {columnHeaders.map((header, index) => (
                    <th
                        key={index}
                        className="border border-gray-300 px-2 py-2 bg-gray-100 font-semibold"
                    >
                        {header}
                    </th>
                    ))}
                </tr>
            </thead>
            <tbody>
            {
                rowHeaders.map((_, rowIndex) =>
                (
                <tr key={rowIndex}>
                    {
                    columnHeaders.map((_, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 px-2 py-2 relative">
                        {
                            ([2, 3].includes(colIndex) ) ?
                            (<Input
                                type="date"
                                value={gridData[rowIndex][colIndex]}
                                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                                />) :
                            (<Textarea
                                className={`w-full h-16 resize-none transition-all duration-300 ${
                                focusedCell?.row === rowIndex && focusedCell?.col === colIndex
                                ? "absolute z-10 top-0 left-0 w-80 h-40 bg-white shadow-md"
                                : ""
                                }`}
                                value={gridData[rowIndex][colIndex]}
                                onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                                onBlur={() => setFocusedCell(null)}
                                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                            /> )
                        }
                        </td>
                    )
                    )
                    }
                    <td className="border border-gray-300 px-2 py-2">
                    {rowIndex > 0 && ( // ✅ Disable delete button for the first row
                        <Button onClick={() => removeRow(rowIndex)} className="bg-red-500 text-white">
                        X
                        </Button>
                    )}
                    </td>
                </tr>
                )
            )
            }
            </tbody>        
        </table>
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
            Complete
        </Button>
        </div>         
    </div>
  )
}