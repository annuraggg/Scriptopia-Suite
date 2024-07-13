import { useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/tabs";
import Submission from "./Submission";
import Quill from "quill";
import { Delta } from "quill/core";
import { ISubmission } from "@/@types/Submission";

const Statement = ({
  statement,
  submissions,
  title,
}: {
  statement: Delta;
  submissions: ISubmission[];
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
    <div className="w-full">
      <Tabs placement="top" className="w-[48%]" variant="underlined">
        <Tab
          key="statement"
          title="Statement &nbsp;&nbsp;"
          className="w-full p-0"
        >
          <Card className="w-full">
            <h6 className="px-5 mt-3">{title}</h6>
            <CardBody className="h-[84.5vh]">
              <div
                id="editor-div"
                className="w-full overflow-auto -mt-10 px-5"
              ></div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="submissions" title="Submissions" className="w-full p-0">
          <Card className="w-full">
            <CardBody className="h-[84.5vh]">
              <Submission submissions={submissions} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Statement;
