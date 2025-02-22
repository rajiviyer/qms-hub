import React from "react";
import Welcome from "./components/Welcome";
// import CARList from "./components/CARList";
import CARLogs from "./components/CARLogs";
import SideBar from "./components/SideBar";

export default function LandingPage() {
  return (
    <div>
      <div className="md:w-64 hidden md:block">
          <SideBar />
      </div>
      <div className="md:ml-64">
        <Welcome />
        {/* <CARList />   */}
        <CARLogs />
      </div>
    </div>
  )
}
