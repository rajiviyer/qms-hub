import React from 'react';
import CARCard from './CARCard';

interface CARDetails {
    car_number: string;
    description: string;
}

export default function CARList() {
    const carList = [
        {
            "car_number": "CAR_001",
            "description": "lorem ipsum dolor sit amet consectetur adipiscing elit"
        },
        {
            "car_number": "CAR_003",
            "description": "lorem ipsum dolor sit amet consectetur adipiscing elit"
        },
        {
            "car_number": "CAR_04001",
            "description": "lorem ipsum dolor sit amet consectetur adipiscing elit"
        },
        {
            "car_number": "CAR_001",
            "description": "lorem ipsum dolor sit amet consectetur adipiscing elit"
        },
        {
          "car_number": "CAR_025",
          "description": "lorem ipsum dolor sit amet consectetur adipiscing elit"
        },
        {
          "car_number": "CAR_051",
          "description": "lorem ipsum dolor sit amet consectetur adipiscing elit"
        },
        {
          "car_number": "CAR_022",
          "description": "lorem ipsum dolor sit amet consectetur adipiscing elit"
        },

    ]
  return (
    <div className="mt-10">
      <h2 className="font-medium text-xl">Corrective Action Requests</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {carList?.length > 0 ? carList.map((car: CARDetails, index) => (
          <CARCard key={index} car={car} className="mb-5"/>
        ))
        : 
          [1,2,3,4,5].map((item, index)=>(
            <div key={index} className="w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[270px]">
            </div>
          ))
      }
      </div>
    </div>
  )
}
