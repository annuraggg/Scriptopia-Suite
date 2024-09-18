import ax from "@/config/axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { Assignment as AssignmentType, Posting } from "@shared-types/Posting";
import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";

const Assignment = () => {
  const { posting } = useOutletContext() as { posting: Posting };
  const [assignment, setAssignment] = React.useState<AssignmentType>();

  const [file, setFile] = React.useState<File>();
  const [allowSubmit, setAllowSubmit] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const { user } = useUser();
  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .post("/candidates/verify", {
        postingId: posting._id,
        userId: user?.id,
      })
      .then(() => {
        const userid = user?.id;
        const candidates = posting?.candidates;

        if (!userid) return;
        if (!candidates) return;

        const currentStep = posting?.workflow?.currentStep;
        if (!currentStep) return;
        if (!posting?.workflow?.steps) return;
        if (!posting?.assignments) return;

        const currentStepObj = posting?.workflow?.steps[currentStep];
        const stepName = currentStepObj?.name;

        const assignment = posting?.assignments.find(
          (a) => a.name === stepName
        );
        setAssignment(assignment);
      })
      .catch((err) => {
        toast.error(err.data.message);
        console.error(err);
        return;
      });
  }, []);

  useEffect(() => {
    if (!file) return;

    // check if file is .zip
    if (
      file?.type !== "application/zip" &&
      file?.type !== "application/x-zip-compressed"
    ) {
      toast.error("Please upload a .zip file");
      return;
    }

    // check if file is less than 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    setAllowSubmit(true);
  }, [file]);

  const handleSubmit = () => {
    // upload file
    setLoading(true);
    const formData = new FormData();
    const postingId = posting?._id?.toString() || "";
    formData.append("postingId", postingId);
    formData.append("userId", user?.id || "");
    formData.append("assignmentId", assignment?._id?.toString() || "");
    if (file) formData.append("file", file);

    axios
      .post(`${import.meta.env.VITE_API_URL}/candidates/assignment/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("Assignment submitted successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data.message || "An error occurred");
        console.log(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-10 py-5">
      <Card className=" h-[69vh]">
        <CardHeader>Assignment</CardHeader>
        <CardBody>
          <div>
            <p>Title: {assignment?.name}</p>
            <p>Description: {assignment?.description}</p>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader>Upload</CardHeader>
        <CardBody className="flex flex-row items-center gap-5">
          <div className="flex gap-3 items-center">
            <p>.zip file (max 10MB)</p>
            <Input
              type="file"
              className="w-[300px] cursor-pointer"
              accept=".zip"
              onChange={(e) => {
                setFile(e?.target?.files![0]);
              }}
            />
          </div>

          <Button
            className="w-[300px]"
            variant="flat"
            color="success"
            disabled={!allowSubmit || loading}
            isLoading={loading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Assignment;
