"use client";
import React, { useState, useContext, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CARProblemDescContext } from "@/app/_context/CARProblemDescContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function FishBoneAnalysis() {
  const carProblemDescContext = useContext(CARProblemDescContext);
  if (!carProblemDescContext) {
    throw new Error("CARProblemDescContext is not available");
  }

  const { carProblemDesc } = carProblemDescContext;
  const car_number = carProblemDesc?.car_number;

  console.log(`In FishBone Analysis page, car number: ${car_number}`);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');  

  // Define Default Headers
  const defaultRowHeaders = ["PEOPLE", "MACHINE", "MATERIAL", "METHODS", "ENVIRONMENT"];
  const defaultColumnHeaders = ["WHY 1", "WHY 2", "WHY 3", "WHY 4", "WHY 5"];  

  const [rowHeaders, setRowHeaders] = useState([...defaultRowHeaders]);
  const [columnHeaders, setColumnHeaders] = useState([...defaultColumnHeaders]);
  const [gridData, setGridData] = useState(
    Array(rowHeaders.length)
      .fill(null)
      .map(() => Array(columnHeaders.length).fill(""))
  );

  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [lastEditedColumn, setLastEditedColumn] = useState<{ [key: number]: number }>({});

  // Fetch existing fishbone data from backend when page loads
  useEffect(() => {
      if (car_number) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get_car_fishbone_analysis/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({car_number: car_number}),
        }).then(response => response.json())
        .then(data => {
          console.log(`data: ${JSON.stringify(data)}`);
         
          if (Array.isArray(data) && data.length > 0) {
            // Create new grid with fetched data
            const newRowHeaders: string[] = Array.from(
              new Set(data.map((item: { row_header: string }) => item.row_header))
            );
            const newColumnHeaders: string[] = Array.from(
              new Set(data.map((item: { column_header: string }) => item.column_header))
            );

            const newGrid = Array(newRowHeaders.length)
              .fill(null)
              .map(() => Array(newColumnHeaders.length).fill(""));

            // Populate grid with database values
            data.forEach((item: any) => {
              const rowIndex = newRowHeaders.indexOf(item.row_header);
              const colIndex = newColumnHeaders.indexOf(item.column_header);
              if (rowIndex !== -1 && colIndex !== -1) {
                newGrid[rowIndex][colIndex] = item.data;
              }
            });

            console.log(`newRowHeaders: ${JSON.stringify(newRowHeaders)}`);
            console.log(`newColumnHeaders: ${JSON.stringify(newColumnHeaders)}`);
            console.log(`newGrid: ${JSON.stringify(newGrid)}`);
            
            setRowHeaders(newRowHeaders);
            setColumnHeaders(newColumnHeaders);
            setGridData(newGrid);

            // Apply color coding for last non-empty column per row
            updateLastColumnHighlight(newGrid);

          }
        }).catch(error => {
          console.error("Error fetching fishbone data:", error);
        });
      }
  }, [car_number]);

  // Function to highlight last non-empty column per row
  const updateLastColumnHighlight = (grid: string[][]) => {
    const newLastEditedColumn: { [key: number]: number } = {};

    grid.forEach((row, rowIndex) => {
      const lastColumnIndex = row.reduce(
        (lastIndex, cell, index) => (cell.trim() !== "" ? index : lastIndex),
        -1
      );

      // Reset previous highlight before setting new one
      if (lastEditedColumn[rowIndex] !== undefined) {
        document.getElementById(`cell-${rowIndex}-${lastEditedColumn[rowIndex]}`)?.classList.remove("text-red-600");
      }      

      // Add highlight to the new last entry
      if (lastColumnIndex !== -1) {
        newLastEditedColumn[rowIndex] = lastColumnIndex;
        setTimeout(() => {
          document.getElementById(`cell-${rowIndex}-${lastColumnIndex}`)?.classList.add("text-red-600");
        }, 100); // Small delay to ensure elements are available in the DOM
      }
    });

    setLastEditedColumn(newLastEditedColumn);
  };  

  const handleInputChange = (row: number, col: number, value: string) => {
    const updatedData = [...gridData];
    updatedData[row][col] = value;
    setGridData(updatedData);
  };

  // Handle Focus
  const handleFocus = (row: number, col: number) => {
    setFocusedCell({ row, col});
    // if (lastEditedColumn[row] !== undefined) {
    //   console.log(`lastEditedColumn[row]: ${JSON.stringify(lastEditedColumn[row])}`);
    //   document.getElementById(`cell-${row}-${lastEditedColumn[row]}`)?.classList.remove("text-red-600");
    // }
  };

  // Handle Blur
  const handleBlur = (row: number) => {
    setFocusedCell(null);
    updateLastColumnHighlight(gridData);    
    // const lastColumnIndex = gridData[row].reduce((lastIndex, cell, index) => (cell.trim() !== "" ? index : lastIndex), -1);

    // if (lastColumnIndex !== -1) {
    //   console.log(`lastColumnIndex: ${lastColumnIndex}`);
      
    //   setLastEditedColumn((prev) => ({ ...prev, [row]: lastColumnIndex }));
    //   document.getElementById(`cell-${row}-${lastColumnIndex}`)?.classList.add("text-red-600");
    // }
  };  

  // Add a Row
  const addRow = () => {
    const newRowHeaders = [...rowHeaders, `NEW ROW ${rowHeaders.length + 1}`];
    setRowHeaders(newRowHeaders);
    setGridData([...gridData, Array(columnHeaders.length).fill("")]);
  };


  // Remove a Row
  const removeRow = (index: number) => {
    if (index < defaultRowHeaders.length) return; // Prevent default row removal
    const newRowHeaders = rowHeaders.filter((_, i) => i !== index);
    const newGrid = gridData.filter((_, i) => i !== index);
    setRowHeaders(newRowHeaders);
    setGridData(newGrid);
  };

  // Add a Column
  const addColumn = () => {
    const newColumnHeaders = [
      ...columnHeaders,
      `WHY ${columnHeaders.length + 1}`,
    ];
    setColumnHeaders(newColumnHeaders);
    setGridData(gridData.map((row) => [...row, ""]));
  };


  // Remove a Column
  const removeColumn = (index: number) => {
    if (index < defaultColumnHeaders.length) return; // Prevent default column removal
    const newColumnHeaders = columnHeaders.filter((_, i) => i !== index);
    const newGrid = gridData.map((row) => row.filter((_, i) => i !== index));
    setColumnHeaders(newColumnHeaders);
    setGridData(newGrid);
  };  

  const handleNext = async () => {
    try{
      console.log("Inside fishbone analysis page handleNext");
      
      const formattedData = rowHeaders.flatMap((rowHeader, rowIndex) =>
        columnHeaders.map((columnHeader, colIndex) => ({
          car_number,
          row_header: rowHeader,
          column_header: columnHeader,
          data: gridData[rowIndex][colIndex] || "",
        }))
      );
        // const response = await axios.post("/api/fishbone", { car_number, entries: formattedData });
      console.log(`formattedData: ${JSON.stringify(formattedData)}`);
      
      const response = await fetch(`${url}/api/add_car_fishbone_analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ car_number, entries: formattedData }),
      });
    
        if (response.ok) {
            const responseMessage = await response.json();
            // console.log(`Message: ${responseMessage}`);
            if (/success/i.test(responseMessage)) {
              setMessageType('success');
              setMessage(responseMessage);
              router?.push("CorrectiveActionPlan");
            }
            else {
            setMessageType('error');
            setMessage(responseMessage);
            }
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handlePrevious = () => {
    router.push("DefineRCAType");
  };    

  console.log(`Column Headers: ${JSON.stringify(columnHeaders)}`);
  console.log(`Row Headers: ${JSON.stringify(rowHeaders)}`);
  

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-2xl text-teal-900 font-medium text-center">
        Fish Bone Analysis
      </h3>
      {message && (
            <p className="text-center" style={{ color: messageType === 'error' ? 'red' : 'green' }}>
            {message}
            </p>
      )}
      <div className="flex space-x-4 mb-4 mt-3">
        <Button onClick={addRow}>Add Row</Button>
        <Button onClick={addColumn}>Add Column</Button>
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-2 bg-gray-100 font-semibold">
              Category
            </th>
            {columnHeaders.map((header, index) => (
              <th
                key={index}
                className="border border-gray-300 px-2 py-2 bg-gray-100 font-semibold"
              >
                {header}
                {index >= defaultColumnHeaders.length && (
                  <button
                  onClick={() => removeColumn(index)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2"
                  >
                    ✖
                  </button>
                )}              
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowHeaders.map((rowHeader, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 px-2 py-2 font-medium bg-gray-50 text-center">
                {rowHeader}
                {rowIndex >= defaultRowHeaders.length && (
                  <button
                  onClick={() => removeRow(rowIndex)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    ✖
                  </button>
                )}                         
              </td>
              {columnHeaders.map((_, colIndex) => (
                <td key={colIndex} className="border border-gray-300 px-2 py-2 relative">
                  {/* <Textarea
                    id={`cell-${rowIndex}-${colIndex}`}
                    className="w-full h-16 resize-none transition-all duration-300"
                    value={gridData[rowIndex][colIndex]}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    onFocus={() => handleFocus(rowIndex)}
                    onBlur={() => handleBlur(rowIndex)}
                  />                   */}
                  <Textarea
                    id={`cell-${rowIndex}-${colIndex}`}
                    className={`w-full h-16 resize-none transition-all duration-300 ${
                      focusedCell?.row === rowIndex && focusedCell?.col === colIndex
                        ? "absolute z-10 top-0 left-0 w-80 h-40 bg-white shadow-md"
                        : ""
                    }`}
                    value={gridData[rowIndex][colIndex]}
                    onFocus={() => handleFocus(rowIndex, colIndex)}
                    onBlur={() => handleBlur(rowIndex)}
                    onChange={(e) =>
                      handleInputChange(rowIndex, colIndex, e.target.value)
                    }
                  />                  
                </td>
              ))}
            </tr>
          ))}
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
            onClick={handleNext}
        >
            Next
        </Button>
      </div>         
    </div>
  );
}
