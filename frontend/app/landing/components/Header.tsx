"use client";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlinePower,
} from "react-icons/hi2";
import { useUserContext } from "@/app/_context/UserContext";

export default function Header() {
  const { logout } = useUserContext();

  return (
    <div className="flex justify-between items-center p-2 shadow-md">
      <Image alt="" src={"/ignition_logo.png"} width={150} height={150} />
      <h2 className="text-2xl font-bold transform -translate-x-20">QMS Hub</h2>
      <div className="flex items-center gap-4">
        <Link href="/landing">
          <div className="text-2xl cursor-pointer hover:text-gray-600"><HiOutlineHome /></div>
        </Link>
        <button
          onClick={logout}
          className="text-2xl cursor-pointer hover:text-gray-600 transition-colors"
          title="Logout"
          aria-label="Logout"
        >
          <HiOutlinePower />
        </button>
      </div>
    </div>
  );
}