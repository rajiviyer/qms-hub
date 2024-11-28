"use client";
import React from 'react';

import {
    HiOutlineHome,
    HiOutlineShieldCheck,
    HiOutlinePower,
    HiOutlineSquare3Stack3D,
  } from "react-icons/hi2";

import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";  


export default function SideBar() {
    const Menu = [
        {
          id: 1,
          name: "Home",
          icon: <HiOutlineHome />,
          path: "/dashboard",
        },
        {
          id: 2,
          name: "Reports",
          icon: <HiOutlineSquare3Stack3D />,
          path: "/dashboard/reports",
        },
        // {
        //   id: 3,
        //   name: "Upgrade",
        //   icon: <HiOutlineShieldCheck />,
        //   path: "/dashboard/upgrade",
        // },
        // {
        //   id: 4,
        //   name: "Logout",
        //   icon: <HiOutlinePower />,
        //   path: "/dashboard/logout",
        // },
      ];
    
      const path = usePathname();    
  return (
    <div className="fixed h-full md:w-64">
      {/* <hr className="my-5" /> */}
      <div>
        <Image alt="" src={"/ignition_audit.svg"} width={150} height={150} />
      </div>
      <div className="mt-10">
        <ul>
          {Menu.map((item, index) => (
            <Link href={item.path} key={index}>
              <div
                className={`flex items-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-4 ${
                  item.path === path && "bg-gray-100 text-black"
                }`}
              >
                <div className="text-2xl">{item.icon}</div>
                <h2>{item.name}</h2>
              </div>
            </Link>
          ))}
        </ul>
      </div>
      {/* <div className="absolute bottom-10 w-[80%]">
        <Progress value={(userCourseList?.length/5)*100} />
        <h2 className="text-sm my-2">{userCourseList?.length} Out of 5 Courses created</h2>
        <h2 className="text-xs text-gray-500">
          Upgrade your plan for unlimited course generation
        </h2>
      </div> */}
    </div>
  )
}
