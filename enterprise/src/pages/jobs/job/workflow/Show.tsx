import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  Button,
  Progress,
  Chip,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useAuth } from "@clerk/clerk-react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import ax from "@/config/axios";
import { Posting, WorkflowStep, StepType } from "@shared-types/Posting";
import {
  IconBook,
  IconCode,
  IconDeviceDesktopPause,
  IconFileCv,
  IconFrustum,
  IconQuestionMark,
} from "@tabler/icons-react";
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
  const { posting } = useOutletContext<{ posting: Posting }>();
  const [loading, setLoading] = useState<boolean>(false);
  const { getToken } = useAuth();
  const axios = ax(getToken);

  // New state for modals
  const [advanceModal, setAdvanceModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
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
    setAdvanceModal(true);
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
      setScheduleModal(false);
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

  const handleAdvanceConfirm = async () => {
    if (!selectedStep) return;
    setLoading(true);
    if (!posting.published) {
      toast.error("Posting is not published");
      setLoading(false);
      return;
    }
    try {
      await axios.post("/postings/advance-workflow", {
        _id: posting._id,
        step: selectedStep.index,
      });
      toast.success("Workflow advanced successfully");
      setAdvanceModal(false);
      setTimeout(() => {
        window.location.reload();
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to advance workflow");
      setLoading(false);
    }
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
      <div className="mb-5 bg-card p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Workflow Progress</h2>
          <span className="text-sm font-medium">
            {completedSteps} of {totalSteps} steps completed
          </span>
        </div>
        <Progress value={progress} className="h-2" color="primary" />
      </div>

      <Alert
        color="secondary"
        title="Workflow not started yet"
        description="You can start the workflow by advancing the first step"
        className="mb-5"
      />

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
                <div className="relative z-10 flex-shrink-0 mt-4">
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
              ${status === "in-progress" ? "border-1 scale-105" : ""}`}
                >
                  {/* Animated Background Layer */}
                  <div
                    className={`absolute inset-0 bg-white before:absolute before:inset-0 before:bg-green-600 before:animate-paintSpread`}
                  ></div>

                  {/* Card Content (Above Animated Background) */}
                  <div
                    className={`relative z-10 flex items-center justify-center min-w-20 rounded-xl 
              ${getStepColor(step.type)}`}
                  >
                    <div className="opacity-80 text-white">
                      {getStepIcon(step.type)}
                    </div>
                  </div>

                  <CardHeader className="p-4 w-[90%] relative z-10">
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
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Advance Confirmation Modal */}
      <Modal isOpen={advanceModal} onClose={() => setAdvanceModal(false)}>
        <ModalHeader>
          <h3 className="text-lg font-semibold">Advance to Next Step?</h3>
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to mark this step as complete and advance to
            the next step?
          </p>
          {selectedStep?.step.schedule && (
            <div className="mt-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <span>
                  Scheduled completion:{" "}
                  {new Date(
                    selectedStep.step.schedule.endTime!
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            onPress={() => setAdvanceModal(false)}
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
      </Modal>

      {/* Schedule Modal */}
      <Modal isOpen={scheduleModal} onClose={() => setScheduleModal(false)}>
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
            onPress={() => setScheduleModal(false)}
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
      </Modal>
    </div>
  );
};

export default Show;
