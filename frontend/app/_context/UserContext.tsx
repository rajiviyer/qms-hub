"use client";
import React, { useState, useContext, createContext, ReactNode, useEffect } from "react";
// import { UserContextType } from "@/lib/type";
import { User, UserEmail } from "@/configs/schema";


interface UserContextType {
  user: User;
  updateUser: (key: keyof User, value: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User>(
    {
      user_email: "",
      user_name: "",
      organization: ""
    });
  
  const updateUser = (key: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const getCookieValue = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(";").shift() || "");
    }
    return "";
  };
  
  const getUserData = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL;    
    const user_email: string = getCookieValue("user_email");
    const user_name: string = getCookieValue("user_name");
    const userEmail: UserEmail = {"user_email": user_email};
    console.log(`userEmail: ${JSON.stringify(userEmail)}`);    
    const response = await fetch(`${url}/api/getuser`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userEmail)
    });
    if (response.ok){
      const data = await response.json();
      console.log(`organization: ${JSON.stringify(data.organization)} type: ${typeof data.organization}`);
      const userDetails: User = {
        user_email: getCookieValue("user_email"),
        user_name: getCookieValue("user_name"),
        organization: data.organization
      };
      console.log("User details from cookies:", userDetails);   
      setUser(userDetails);
    }
    else {
      const errorData = await response.json();
      console.log(errorData);
    }
  };

  useEffect(() => {
      getUserData();
    }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to access the context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
      throw new Error('UserContext must be used within a UserContext Provider');
  }
  return context;
}