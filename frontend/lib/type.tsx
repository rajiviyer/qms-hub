import { createContext, Dispatch, SetStateAction } from "react";
// import { CourseDetails, User, UserCourseInput } from "@/configs/schema";
import { User } from "@/configs/schema";

export type UserContextType = [
  User,
  Dispatch<SetStateAction<User>>
]