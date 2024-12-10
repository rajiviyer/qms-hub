"use client";
import React, { useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserContext } from "@/app/_context/UserContext";

export default function Welcome() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserContext is not available');
  }
  const [ user, setUser] = userContext;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const get_user_details = async () => {
    const response = await fetch(`${url}/api/getuser`, {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: user?.user_email
    });
    if (response.ok){
      const data = await response.json();
      console.log(data);
      setUser(data);
    }
    else {
      const errorData = await response.json();
      console.log(errorData);
    }
  }  

  useEffect(() => {
    get_user_details();
  }, []);
  // const user = {user_email: "raju.rgi@gmail.com", user_name: "Sriram"};

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
