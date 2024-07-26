import React from "react";
import Blank from "./Blank";
import Create from "./Create";

const Workflow = () => {
  const [create, setCreate] = React.useState(false);
  return (
    <div>
      {!create && <Blank setCreate={setCreate} />}
      {create && <Create />}
    </div>
  );
};

export default Workflow;
