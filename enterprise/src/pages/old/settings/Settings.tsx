import Navbar from "@/components/Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import General from "./General";
import Members from "./Members";

const Settings = () => {
  const [active, setActive] = useState("General");
  return (
    <div className="h-cover">
      <Navbar />
      <div className="flex h-[90vh] w-full">
        <Sidebar active={active} setActive={setActive} />
        <div className="p-10 w-full h-full">
          {active === "General" && <General />}
          {active === "Members" && <Members />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
