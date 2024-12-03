import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function RootCauseAnalysis() {
    const rowHeaders = ["PEOPLE", "MACHINE", "MATERIAL", "METHODS", "ENVIRONMENT"];
    const columnHeaders = ["WHY 1", "WHY 2", "WHY 3", "WHY 4", "WHY 5"];
  
    const [gridData, setGridData] = useState(
      Array(rowHeaders.length)
        .fill(null)
        .map(() => Array(columnHeaders.length).fill(""))
    );
  
    const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  
    // Handle input changes
    const handleInputChange = (row: number, col: number, value: string) => {
      const updatedData = [...gridData];
      updatedData[row][col] = value;
      setGridData(updatedData);
    };
  
    return (
        <div className="p-4 space-y-4">
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
                  <td key={colIndex} className="border border-gray-300 px-2 py-2 relative">
                    <Textarea
                      className={`w-full h-16 resize-none transition-all duration-300 ${
                        focusedCell?.row === rowIndex && focusedCell?.col === colIndex
                          ? "absolute z-10 top-0 left-0 w-80 h-40 bg-white shadow-md"
                          : ""
                      }`}
                      value={gridData[rowIndex][colIndex]}
                      onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                      onBlur={() => setFocusedCell(null)}
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
  };
