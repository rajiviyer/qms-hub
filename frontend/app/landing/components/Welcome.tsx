"use client";
import React, { useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserContext } from "@/app/_context/UserContext";
import { UserEmail, User } from "@/configs/schema";

export default function Welcome() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserContext is not available');
  }
  const { user, updateUser } = userContext;

  console.log(`user: ${JSON.stringify(user)}`);
  
  
  // const url = process.env.NEXT_PUBLIC_API_URL;

  // useEffect(() => {
  //   updateUserOrg();
  // }, [user]);

  // const updateUserOrg = async () => {
  //   const userEmail: UserEmail = {"user_email": user?.user_email};
  //   console.log(`userEmail: ${JSON.stringify(userEmail)}`);

  //   const response = await fetch(`${url}/api/getuser`, {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(userEmail)
  //   });
  //   if (response.ok){
  //     const data = await response.json();
  //     console.log(data);
  //     updateUser("organization" as keyof typeof user, data.organization);
  //   }
  //   else {
  //     const errorData = await response.json();
  //     console.log(errorData);
  //   }
  // }  

  // console.log(`user: ${JSON.stringify(user)}`);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl">
          Hello, <span className="font-bold text-primary">{user?.user_name}</span>
        </h2>
        <p className="text-sm text-gray-500">
          {`View Existing CARs and Create new Ones for ${user?.organization}`}
        </p>
      </div>
      <Link href="/create-car">
        <Button className="bg-primary text-black">+ Create CAR</Button>
      </Link>
    </div>
  );
}
