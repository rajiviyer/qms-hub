import React from 'react';
import Link from "next/link";

export default function CARCard({car, edit = true}: any) {
  return (
    <div className="shadow-md rounded-lg p-2 text-center item-center cursor-pointer mt-4 hover:bg-gray-900 bg-gray-700">
        {/* hover: scale-105 transition-all  */}

        <div className="p-2">
            <Link href={`/cars/${car?.car_number}`}>
                <h2 className="font-medium text-lg text-zinc-200">{car?.car_number}</h2>
            </Link>
            {/* <p className="text-sm text-gray-400 my-1">{car?.description}</p> */}
        </div>
    </div>
  )
}
