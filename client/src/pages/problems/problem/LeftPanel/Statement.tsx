import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header"; // @ts-expect-error - no types available
import Link from "@editorjs/link"; // @ts-expect-error - no types available
import SimpleImage from "@editorjs/simple-image"; // @ts-expect-error - no types available
import Checklist from "@editorjs/checklist"; // @ts-expect-error - no types available
import List from "@editorjs/list"; // @ts-expect-error - no types available
import Code from "@editorjs/code"; // @ts-expect-error - no types available
import Table from "@editorjs/table"; // @ts-expect-error - no types available
import Warning from "@editorjs/warning"; // @ts-expect-error - no types available
import inlineCode from "@editorjs/inline-code";
import { useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/tabs";
import Submission from "./Submission";
import { Submission as SubmissionType } from "../types";

const Statement = ({
  statement,
  submissions,
}: {
  statement: OutputData;
  submissions: SubmissionType[];
}) => {
  useEffect(() => {
    if (!statement) return;

    setTimeout(() => {
      new EditorJS({
        holder: "editor-div",
        readOnly: true,
        tools: {
          header: Header,
          link: Link,
          image: SimpleImage,
          checklist: Checklist,
          list: List,
          code: Code,
          table: Table,
          warning: Warning,
          inlineCode: inlineCode,
        },
        data: statement,
      });
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
