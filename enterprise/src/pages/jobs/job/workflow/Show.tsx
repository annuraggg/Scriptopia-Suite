import React, { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Alert } from "@heroui/alert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useAuth } from "@clerk/clerk-react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import ax from "@/config/axios";
import { WorkflowStep, StepType } from "@shared-types/Posting";
import {
  IconBook,
  IconCode,
  IconDeviceDesktopPause,
  IconFileCv,
  IconFrustum,
  IconQuestionMark,
} from "@tabler/icons-react";
import { PostingContext } from "@/types/PostingContext";
interface ShowProps {
  workflowData: WorkflowStep[];
}

const stepTypeMap: Record<StepType, string> = {
  RESUME_SCREENING: "Resume Screening",
  MCQ_ASSESSMENT: "MCQ Assessment",
  CODING_ASSESSMENT: "Coding Assessment",
  ASSIGNMENT: "Assignment",
  INTERVIEW: "Interview",
  CUSTOM: "Custom",
};

const getStepIcon = (type: StepType): JSX.Element => {
  switch (type) {
    case "RESUME_SCREENING":
      return <IconFileCv size={30} />;
    case "MCQ_ASSESSMENT":
      return <IconQuestionMark size={30} />;
    case "CODING_ASSESSMENT":
      return <IconCode size={30} />;
    case "ASSIGNMENT":
      return <IconBook size={30} />;
    case "INTERVIEW":
      return <IconDeviceDesktopPause size={30} />;
    case "CUSTOM":
      return <IconFrustum size={30} />;
    default:
      return <IconFrustum size={30} />;
  }
};

const getStepColor = (type: StepType): string => {
  switch (type) {
    case "RESUME_SCREENING":
      return "bg-blue-400";
    case "MCQ_ASSESSMENT":
      return "bg-green-400";
    case "CODING_ASSESSMENT":
      return "bg-yellow-400";
    case "ASSIGNMENT":
      return "bg-purple-400";
    case "INTERVIEW":
      return "bg-red-400";
    case "CUSTOM":
      return "bg-default-400";
    default:
      return "bg-default-400";
  }
};

const Show: React.FC<ShowProps> = ({ workflowData }) => {
  const { posting, setPosting } = useOutletContext() as PostingContext;
  const [loading, setLoading] = useState<boolean>(false);
  const { getToken } = useAuth();
  const axios = ax(getToken);

  const {
    isOpen: isAdvanceModalOpen,
    onClose: onAdvanceModalClose,
    onOpen: onAdvanceModalOpen,
    onOpenChange: onAdvanceModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isScheduleModalOpen,
    onClose: onScheduleModalClose,
    onOpen: onScheduleModalOpen,
    onOpenChange: onScheduleModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isEndModalOpen,
    onClose: onEndModalClose,
    onOpen: onEndModalOpen,
    onOpenChange: onEndModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isLessThanTwoModalOpen,
    onClose: onLessThanTwoModalClose,
    onOpen: onLessThanTwoModalOpen,
    onOpenChange: onLessThanTwoModalOpenChange,
  } = useDisclosure();

  const [selectedStep, setSelectedStep] = useState<{
    step: WorkflowStep;
    index: number;
  } | null>(null);
  const [scheduleData, setScheduleData] = useState({
    startTime: "",
    endTime: "",
  });

  const completedSteps =
    posting.workflow?.steps.filter((s) => s.status === "completed").length || 0;
  const totalSteps = workflowData.length;
  const progress = (completedSteps / totalSteps) * 100;

  const advance = async (step: number): Promise<void> => {
    onAdvanceModalOpen();
    setSelectedStep({ step: workflowData[step], index: step });
  };

  const handleSchedule = async () => {
    if (!selectedStep || !scheduleData.startTime || !scheduleData.endTime)
      return;
    setLoading(true);

    try {
      await axios.post("/postings/schedule-step", {
        postingId: posting._id,
        stepId: selectedStep.step._id,
        schedule: {
          startTime: new Date(scheduleData.startTime),
          endTime: new Date(scheduleData.endTime),
        },
      });

      toast.success("Step scheduled successfully");
      onScheduleModalClose();
      setScheduleData({ startTime: "", endTime: "" });
      setSelectedStep(null);

      setTimeout(() => {
        window.location.reload();
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to schedule step");
      setLoading(false);
    }
  };

  const cancelAdvance = () => {
    onLessThanTwoModalClose();
    onAdvanceModalClose();
  };

  const handleAdvanceConfirm = async () => {
    if (!selectedStep) return;

    if (!isLessThanTwoModalOpen) {
      const allAppliedPostings = posting?.candidates?.map((candidate) =>
        candidate.appliedPostings.find(
          (appliedPosting) => appliedPosting.posting === posting._id
        )
      );

      const qualifiedCandidates = allAppliedPostings?.filter(
        (appliedPosting) => appliedPosting?.status === "inprogress"
      );

      if (qualifiedCandidates?.length < 2) {
        onLessThanTwoModalOpen();
        return;
      }
    }

    onLessThanTwoModalClose();

    setLoading(true);
    if (!posting.published) {
      toast.error("Posting is not published");
      setLoading(false);
      return;
    }

    await axios
      .post("/postings/advance-workflow", {
        _id: posting._id,
        step: selectedStep.index,
      })
      .then((res) => {
        toast.success("Workflow advanced successfully");
        onAdvanceModalClose();
        setSelectedStep(null);
        setPosting(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to advance workflow");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStepStatus = (step: WorkflowStep): string => {
    const currentStepIndex = workflowData.findIndex(
      (s) => s.status === "in-progress"
    );

    const nextStep = workflowData[currentStepIndex + 1];
    if (nextStep && nextStep._id === step._id) return "upcoming";

    return step.status;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {posting.published && (
        <div className="mb-5 bg-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Workflow Progress</h2>
            <span className="text-sm font-medium">
              {completedSteps} of {totalSteps} steps completed
            </span>
          </div>
          <Progress value={progress} className="h-2" color="primary" />
        </div>
      )}

      {posting.published && posting.workflow?.steps[0].status === "pending" && (
        <Alert
          color="secondary"
          title="Workflow not started yet"
          description="You can start the workflow by advancing the first step"
          className="mb-5"
        />
      )}

      {!posting.published && (
        <Alert
          color="secondary"
          title="Posting Not Published Yet"
          description="You need to publish this posting first before it is available for workflow operations"
          className="mb-5"
        />
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div className="absolute left-[0.7rem] top-0 bottom-0 w-px bg-default-100" />

        {workflowData.map((step, index) => {
          const status = getStepStatus(step);
          return (
            <motion.div
              key={step._id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4"
            >
              <div className="flex items-start gap-6">
                <div className="relative  flex-shrink-0 mt-4">
                  {status === "completed" && (
                    <div className="w-7 h-7 rounded-full bg-success-50 border-2 border-success-500 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-success-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  {status === "in-progress" && (
                    <div className="w-7 h-7 rounded-full bg-primary-50 border-2 border-primary-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                    </div>
                  )}
                  {(status === "pending" || status === "upcoming") && (
                    <div className="w-7 h-7 rounded-full bg-default-50 border-2 border-default-200 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-default-300" />
                    </div>
                  )}
                </div>

                <Card
                  className={`flex-1 flex-row relative overflow-hidden border 
              ${status === "in-progress" ? "border-1 scale-105 ml-5" : ""}`}
                >
                  {/* Animated Background Layer */}
                  <div
                    className={`absolute inset-0 bg-white before:absolute before:inset-0 `}
                  ></div>

                  {/* Card Content (Above Animated Background) */}
                  <div
                    className={`relative  flex items-center justify-center min-w-20 rounded-xl 
              ${getStepColor(step.type)}`}
                  >
                    <div className="opacity-80 text-white">
                      {getStepIcon(step.type)}
                    </div>
                  </div>

                  <CardHeader className="p-4 w-[90%] relative ">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-default-400">
                            Step {index + 1}
                          </span>
                          {status === "in-progress" && (
                            <Chip color="success" variant="flat" size="sm">
                              Current
                            </Chip>
                          )}
                        </div>
                        <h3 className="text-base font-semibold">{step.name}</h3>
                        <p className="text-sm text-default-500">
                          {stepTypeMap[step.type]}
                        </p>
                        {step.schedule && (
                          <p className="text-xs text-default-400 mt-1">
                            Scheduled:{" "}
                            {new Date(
                              step.schedule.startTime!
                            ).toLocaleString()}{" "}
                            -{" "}
                            {new Date(step.schedule.endTime!).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {status === "upcoming" && posting.published && (
                          <>
                            <Button
                              color="primary"
                              size="sm"
                              onPress={() => advance(index)}
                              isLoading={loading}
                              className="text-black"
                            >
                              Advance
                            </Button>
                            {step.type !== "CUSTOM" &&
                              step.type !== "INTERVIEW" &&
                              step.type !== "RESUME_SCREENING" && (
                                <Button
                                  variant="bordered"
                                  size="sm"
                                  onPress={() => {
                                    setSelectedStep({ step, index });
                                    onScheduleModalOpen();
                                  }}
                                  isLoading={loading}
                                >
                                  Schedule
                                </Button>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </motion.div>
          );
        })}
        {/* Show End Workflow Button only if all steps are completed */}
        {completedSteps === totalSteps - 1 && (
          <Button
            color="success"
            className="float-right mt-3 "
            onPress={onEndModalOpen}
            isLoading={loading}
          >
            End Workflow
          </Button>
        )}
      </motion.div>

      {/* End Workflow Modal */}
      <Modal
        isOpen={isEndModalOpen}
        onOpenChange={onEndModalOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">End Workflow?</h3>
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to end the workflow? You will still be able
              to access and manage the candidates in the posting. This action
              will mark all rounds as completed.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={() => onEndModalClose()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => onEndModalClose()}
              isLoading={loading}
            >
              End Workflow
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Advance Confirmation Modal */}
      <Modal
        isOpen={isAdvanceModalOpen}
        onOpenChange={onAdvanceModalOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {" "}
          <ModalHeader>
            <h3 className="text-lg font-semibold">Advance to Next Step?</h3>
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to mark this step as complete and advance to
              the next step?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={() => onAdvanceModalClose()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAdvanceConfirm}
              isLoading={loading}
            >
              Advance Step
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onOpenChange={onScheduleModalOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">Schedule Step</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full border rounded-md shadow-sm"
                  value={scheduleData.startTime}
                  onChange={(e) =>
                    setScheduleData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">End Time</label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full border rounded-md shadow-sm"
                  value={scheduleData.endTime}
                  onChange={(e) =>
                    setScheduleData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  min={
                    scheduleData.startTime ||
                    new Date().toISOString().slice(0, 16)
                  }
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={() => onScheduleModalClose()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSchedule}
              isLoading={loading}
              disabled={!scheduleData.startTime || !scheduleData.endTime}
            >
              Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Less than 2 Modal */}
      <Modal
        isOpen={isLessThanTwoModalOpen}
        onOpenChange={onLessThanTwoModalOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">Less than 2 Candidates</h3>
          </ModalHeader>
          <ModalBody>
            There are less than 2 candidates in this posting. You can continue
            to hire the candidate without next workflow steps. Do you still want
            to continue?
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={() => cancelAdvance()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAdvanceConfirm}
              isLoading={loading}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Show;
