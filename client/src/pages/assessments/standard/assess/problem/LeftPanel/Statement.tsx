import { useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import Quill from "quill";
import { Delta } from "quill/core";

const Statement = ({
  statement,
  title,
}: {
  statement: Delta;
  title: string;
}) => {
  useEffect(() => {
    setTimeout(() => {
      const quill = new Quill("#editor-div", {
        readOnly: true,
        theme: "bubble",
        modules: {
          toolbar: false,
        },
      });
      quill.setContents(statement);
    }, 100);
  }, [statement]);

  return (
    <div className="w-full h-full">
      <Card className="w-full h-full">
        <p>Statement</p>
        <h6 className="px-5 mt-3">{title}</h6>
        <CardBody className="h-[79.5vh]">
          <div id="editor-div" className="w-full overflow-auto -mt-10"></div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Statement;
