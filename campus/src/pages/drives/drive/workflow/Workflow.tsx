import React from "react";
import Blank from "./Blank";
import Create from "./Create";
import { useOutletContext } from "react-router-dom";
import Show from "./Show";
import { Drive } from "@shared-types/Drive";

const Workflow = () => {
  const { drive } = useOutletContext() as { drive: Drive };
  const [create, setCreate] = React.useState(false);

  return (
    <div>
      {!drive?.workflow?.steps?.length && !create && (
        <Blank setCreate={setCreate} />
      )}
      {!drive.workflow?.steps?.length && create && <Create />}

      {drive?.workflow?.steps?.length && (
        <Show workflowData={drive?.workflow?.steps} />
      )}
    </div>
  );
};

export default Workflow;
