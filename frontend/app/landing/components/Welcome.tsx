import React, { useContext } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserContext } from "@/app/_context/UserContext";

export default function Welcome() {
  // const userContext = useContext(UserContext);
  // if (!userContext) {
  //   throw new Error('UserContext is not available');
  // }
  // const [ user, setUser] = userContext;
  const user = {user_email: "raju.rgi@gmail.com", user_name: "Rajiv Iyer"};

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl">
          Hello, <span className="font-bold text-primary">{user?.user_name}</span>
        </h2>
        <p className="text-sm text-gray-500">
          View Existing CARs and Create new Ones
        </p>
      </div>
      <Link href="/create-car">
        <Button className="bg-primary text-black">+ Create CAR</Button>
      </Link>
    </div>
  );
}
