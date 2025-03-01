import { useEffect } from "react";
import { Card, CardBody } from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import Submission from "./Submission";
import Quill from "quill";
import { Delta } from "quill/core";
import { Submission as SubmissionType} from "@shared-types/Submission";

const Statement = ({
  statement,
  submissions,
  title,
  setActiveTab,
  activeTab,
  loading,

  allowSubmissionsTab,
}: {
  statement: Delta;
  submissions: SubmissionType[];
  title: string;
  setActiveTab: (key: string) => void;
  activeTab: string;
  loading: boolean;

  allowSubmissionsTab: boolean;
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
  }, [statement, activeTab]);

  return (
    <div className="w-full">
      <Tabs
        placement="top"
        className="w-[48%]"
        variant="underlined"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key.toString())}
      >
        <Tab
          key="statement"
          title="Statement &nbsp;&nbsp;"
          className="w-full p-0"
        >
          <Card className="w-full">
            <h6 className="px-5 mt-3">{title}</h6>
            <CardBody className="h-[79.5vh]">
              <div
                id="editor-div"
                className="w-full overflow-auto -mt-10"
              ></div>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="submissions"
          title="Submissions"
          className={`w-full p-0 ${allowSubmissionsTab ? "" : "hidden"}`}
          isDisabled={!allowSubmissionsTab}
        >
          <Card className="w-full">
            <CardBody className="h-[84.5vh]">
              <Submission submissions={submissions} loading={loading} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Statement;
