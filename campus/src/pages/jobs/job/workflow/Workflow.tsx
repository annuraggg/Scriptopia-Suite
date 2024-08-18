import React from "react";
import Blank from "./Blank";
import Create from "./Create";
import { useOutletContext } from "react-router-dom";

const Workflow = () => {
  const { drive } = useOutletContext();
  const [create, setCreate] = React.useState(false);

  return (
    <div>
      {(!drive?.workflow?.steps?.length && !create) && <Blank setCreate={setCreate} />}
      {create && <Create />}
    </div>
  );
};

export default Workflow;
