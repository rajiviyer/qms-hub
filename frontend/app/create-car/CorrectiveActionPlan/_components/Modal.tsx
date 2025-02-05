"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import { CARRootCause } from '@/configs/schema';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: CARRootCause | null;
}

export default function Modal({ isOpen, onClose, content }: ModalProps) {
  if (!isOpen) return null;

  const { car_number, root_cause } = content || {};
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');    
  const url = process.env.NEXT_PUBLIC_API_URL;

  const [rowHeaders, setRowHeaders] = useState([
    "ROW1",
    "ROW2",
    "ROW2",
    "ROW2",
    "ROW2",
  ]);
  const [columnHeaders, setColumnHeaders] = useState([
    "Corrective Action",
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

  // Fetch existing fishbone data from backend when page loads
  useEffect(() => {
      if (car_number) {
        fetch(`${url}/api/get_car_cap_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({car_number: car_number, root_cause: root_cause}),
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
          }
        }).catch(error => {
          console.error("Error fetching CAR CAP data:", error);
        });
      }
  }, [car_number]);  

  const handleInputChange = (row: number, col: number, value: string) => {
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

  const convertGridToObjects = (gridData: string[][], columnHeaders: string[], car_number: string, root_cause: string) => {
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
  
      return { car_number: car_number, root_cause: root_cause, ...formattedRow };
    });
  };
  

  const saveData = () => {
    if (car_number && root_cause) {
      const formattedData = convertGridToObjects(gridData, columnHeaders, car_number, root_cause);      
      fetch(`${url}/api/add_car_cap_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      }).then(response => response.json())
      .then(data => {
        console.log(`data: ${JSON.stringify(data)}`);
        setMessage(data.message);
        setMessageType(data.messageType);
      }).catch(error => {
        console.error("Error saving CAR CAP data:", error);
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px] max-w-full max-h-[90vh] overflow-y-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Root Cause</h2>
        <p className="mb-4">{content? content.root_cause : "No Content"}</p>
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
              rowHeaders.map((rowHeader, rowIndex) =>
              (
                <tr key={rowIndex}>
                  {
                    columnHeaders.map((_, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 px-2 py-2 relative">
                        {
                          <Textarea
                            className={`w-full h-16 resize-none transition-all duration-300 ${
                            focusedCell?.row === rowIndex && focusedCell?.col === colIndex
                            ? "absolute z-10 top-0 left-0 w-80 h-40 bg-white shadow-md"
                            : ""
                            }`}
                            value={gridData[rowIndex][colIndex]}
                            onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                            onBlur={() => setFocusedCell(null)}
                            onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                          /> 
                        }
                      </td>
                    )
                  )
                  }
                </tr>
              )
            )
            }
          </tbody>        
        </table>
        <div className="flex space-x-4 mb-4 mt-3">
          <Button onClick={onClose} className="w-full text-primary mt-5">Close</Button>
          <Button onClick={onClose} className="w-full text-primary mt-5">Save</Button>
        </div>
        
      </div>
    </div>
  );
}
