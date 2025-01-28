"use client";
import React, { useState, useContext } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CARProblemDescContext } from "@/app/_context/CARProblemDescContext";

export default function FishBoneAnalysis() {
  const carProblemDescContext = useContext(CARProblemDescContext);
  if (!carProblemDescContext) {
    throw new Error("CARProblemDescContext is not available");
  }

  const { carProblemDesc } = carProblemDescContext;
  const car_number = carProblemDesc?.car_number;

  const [rowHeaders, setRowHeaders] = useState([
    "PEOPLE",
    "MACHINE",
    "MATERIAL",
    "METHODS",
    "ENVIRONMENT",
  ]);
  const [columnHeaders, setColumnHeaders] = useState([
    "WHY 1",
    "WHY 2",
    "WHY 3",
    "WHY 4",
    "WHY 5",
  ]);
  const [gridData, setGridData] = useState(
    Array(rowHeaders.length)
      .fill(null)
      .map(() => Array(columnHeaders.length).fill(""))
  );

  const handleInputChange = (row: number, col: number, value: string) => {
    const updatedData = [...gridData];
    updatedData[row][col] = value;
    setGridData(updatedData);
  };

  const addRow = () => {
    const newRowHeaders = [...rowHeaders, `NEW ROW ${rowHeaders.length + 1}`];
    setRowHeaders(newRowHeaders);
    setGridData([...gridData, Array(columnHeaders.length).fill("")]);
  };

  const addColumn = () => {
    const newColumnHeaders = [
      ...columnHeaders,
      `NEW COLUMN ${columnHeaders.length + 1}`,
    ];
    setColumnHeaders(newColumnHeaders);
    setGridData(gridData.map((row) => [...row, ""]));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4 mb-4">
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
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowHeaders.map((rowHeader, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 px-2 py-2 font-medium bg-gray-50 text-center">
                {rowHeader}
              </td>
              {columnHeaders.map((_, colIndex) => (
                <td key={colIndex} className="border border-gray-300 px-2 py-2">
                  <Textarea
                    className="w-full h-16 resize-none"
                    value={gridData[rowIndex][colIndex]}
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
    </div>
  );
}
