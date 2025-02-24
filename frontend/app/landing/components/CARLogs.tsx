"use client";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "@/app/_context/UserContext";
import { UserEmail, User, CarLog } from "@/configs/schema";
import Link from "next/link";
import { HiPencilSquare } from "react-icons/hi2";

function CARLogs() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserContext is not available');
  }
  const { user, updateUser } = userContext;
  const [carLogs, setCarLogs] = useState<CarLog[]>([
    {
      car_number: "",
      initiation_date: "",
      source: "",
      target_date: ""}
  ]);

  console.log(`user: ${JSON.stringify(user)}`);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (user) {
      const user_org = user.organization;
      fetch (`${API_URL}/api/get_car_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_org}),
      }).then(response => response.json()).then(data => {
        console.log(`CAR Logs: ${JSON.stringify(data)}`);
        setCarLogs(data);
      }).catch(error => {
        console.error('Error in fetching car logs', error);
      });
    }
  }, [user]);
  
  
  return (
    <div className="mt-10">
        <h2 className="font-medium text-xl">Corrective Action Requests Log</h2>
        {/* display car logs data in tabular format */}
        <table className="min-w-full divide-y divide-gray-100 mt-6">
            <thead>
                <tr>
                    <th className="px-6 py-3 bg-primary text-left text-xs leading-4 font-medium text-black uppercase tracking-wider"></th>
                    <th className="px-6 py-3 bg-primary text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">CAR Number</th>
                    <th className="px-6 py-3 bg-primary text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">Initiation Date</th>
                    <th className="px-6 py-3 bg-primary text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 bg-primary text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">Target Date</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {carLogs.map((carLog, index) => (
                    <tr key={index}>
                        {/* First entry for car number should be a link to the /create-car page */}
                        <td><Link href={`/create-car/?car_number=${carLog?.car_number}`}><HiPencilSquare size={20} /></Link></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{carLog?.car_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{carLog?.initiation_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{carLog?.source}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {
                                new Date(carLog?.target_date) < new Date() ? (
                                <span className="text-red-500">{carLog?.target_date}</span>
                                ) : (
                                new Date(carLog?.target_date) < new Date(new Date().setDate(new Date().getDate() + 7)) ? (
                                    <span className="text-orange-500">{carLog?.target_date}</span>
                                ) : (
                                    <span>{carLog?.target_date}</span>
                                )
                                )   
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default CARLogs