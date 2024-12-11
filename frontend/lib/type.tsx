import { createContext, Dispatch, SetStateAction } from "react";
// import { CourseDetails, User, UserCourseInput } from "@/configs/schema";
import { User, CARProblemDesc } from "@/configs/schema";

export type UserContextType = [
  User,
  Dispatch<SetStateAction<User>>
]

// export type CARProblemDescContextType = [
//   CARProblemDesc,
//   Dispatch<SetStateAction<CARProblemDesc>>
// ]
