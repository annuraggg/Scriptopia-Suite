import React from "react";
import Blank from "./Blank";
import Create from "./Create";
import { useOutletContext } from "react-router-dom";
import Show from "./Show";
import { Posting } from "@shared-types/Posting";

const Workflow = () => {
  const { posting } = useOutletContext() as { posting: Posting };
  const [create, setCreate] = React.useState(false);

  return (
    <div>
      {!posting?.workflow?.steps?.length && !create && (
        <Blank setCreate={setCreate} />
      )}
      {!posting.workflow?.steps?.length && create && <Create />}

      {posting?.workflow?.steps?.length && (
        <Show workflowData={posting?.workflow?.steps} />
      )}
    </div>
  );
};

export default Workflow;
