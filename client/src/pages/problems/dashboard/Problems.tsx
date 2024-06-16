import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ProblemsList from "./ProblemsList";
import Dashboard from "./Dashboard";
import UserGenerated from "./UserGenerated";
import ConundrumCubes from "./ConundrumCubes";
import MyProblems from "./MyProblems";

const Problems = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
      const hash = window.location.hash;
      if (hash === "#") setActive(0);
      if (hash === "#problems") setActive(1);
      if (hash === "#user-generated") setActive(2);
      if (hash === "#conundrum-cubes") setActive(3);
      if (hash === "#my-problems") setActive(4);
    }, []);

  return (
    <div className="h-full flex gap-5">
        <Sidebar active={active} setActive={setActive} />
        {active === 0 && <Dashboard />}
        {active === 1 && <ProblemsList />}
        {active === 2 && <UserGenerated />}
        {active === 3 && <ConundrumCubes />}
        {active === 4 && <MyProblems />}
    </div>
  );
};

export default Problems;
