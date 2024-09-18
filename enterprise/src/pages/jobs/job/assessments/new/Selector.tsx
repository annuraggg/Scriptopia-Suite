import { useEffect, useState } from "react";
import CodeNew from "./code/New";
import CodeMcqNew from "./mcqcode/New";
import McqNew from "./mcq/New";
import { useOutletContext } from "react-router-dom";
import { Posting } from "@shared-types/Posting";

const Selector = () => {
  const [type, setType] = useState<string>("");
  const [name, setName] = useState<string>("");

  const { posting } = useOutletContext() as { posting: Posting };

  useEffect(() => {
    const type = window.location.pathname.split("/").pop();
    const step = new URLSearchParams(window.location.search).get("step") || "0";
    const name = posting?.workflow?.steps![parseInt(step)]?.name;

    setName(name || "");
    setType(type || "");
  }, []);

  if (type === "ca") {
    return (
      <div className="flex justify-center items-center h-screen w-full p-10">
        <CodeNew assessmentName={name} />
      </div>
    );
  }

  if (type === "mcqca") {
    return (
      <div className="flex justify-center items-center h-screen w-full p-10">
        <CodeMcqNew assessmentName={name} />
      </div>
    );
  }

  if (type === "mcqa") {
    return (
      <div className="flex justify-center items-center h-screen w-full p-10">
        <McqNew assessmentName={name} />
      </div>
    );
  }
};

export default Selector;
