"use client";
import React, { useState, useContext, createContext, ReactNode } from "react";
// import { UserContextType } from "@/lib/type";
import { User } from "@/configs/schema";


interface UserContextType {
  user: User;
  updateUser: (key: keyof User, value: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
    // Function to get a cookie value by name
  const getCookieValue = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(";").shift() || "");
    }
    return "";
  };

  // Debugging: log the cookies to see what is available
  console.log("Current cookies:", document.cookie);

  // Get the user email and username from the cookies
  const userDetails: User = {
    user_email: getCookieValue("user_email"),
    user_name: getCookieValue("user_name"),
    organization: ""
  }

  console.log("User details from cookies:", userDetails);
  const [user, setUser] = useState<User>(userDetails);
  const updateUser = (key: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };    
  // setUser(userDetails);

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