import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineHome,
} from "react-icons/hi2";
export default function Header() {
  return (
    <div className="flex justify-between items-center p-2 shadow-md">
      <Image alt="" src={"/ignition_logo.png"} width={150} height={150} />
      <h2 className="text-2xl font-bold transform -translate-x-20">QMS Hub</h2>
      <Link href="/landing">
        <div className="text-2xl"><HiOutlineHome /></div>
      </Link>
    </div>
  );
}