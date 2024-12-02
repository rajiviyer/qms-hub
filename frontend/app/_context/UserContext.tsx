"use client";
import { createContext } from "react";
import { UserContextType } from "@/lib/type";

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);