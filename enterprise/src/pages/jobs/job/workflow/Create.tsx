import { useState } from "react";
import {
  FileText,
  Code,
  MonitorPlay,
  Edit2,
  Trash,
  Combine,
  Book,
  Copy,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  DateValue,
  Divider,
  TimeInput,
  TimeInputValue,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";
import { DatePicker } from "@nextui-org/react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

const Create = () => {
  const [page, setPage] = useState(0);

  const [auto, setAuto] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [addedComponents, setAddedComponents] = useState<
    { icon: React.ElementType; label: string; name: string; id: string }[]
  >([]);
  const [autoSchedule, setAutoSchedule] = useState<
    {
      start: DateValue | null;
      end: DateValue | null;
      startTime: TimeInputValue | null;
      endTime: TimeInputValue | null;
    }[]
  >([]);

  const components = [
    {
      icon: FileText,
      label: "ATS",
    },
    {
      icon: Copy,
      label: "MCQ Assessment",
    },
    {
      icon: Code,
      label: "Code Assessment",
    },
    {
      icon: Combine,
      label: "MCQ + Code Assessment",
    },
    {
      icon: Book,
      label: "Assignment",
    },
    {
      icon: MonitorPlay,
      label: "Interview",
    },
  ];

  const dragStart = (e: React.DragEvent<HTMLDivElement>, label: string) => {
    e.dataTransfer.setData("text", label);
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const label = e.dataTransfer.getData("text");
    const component = components.find((c) => c.label === label);

    if (component) {
      const newComponent = {
        ...component,
        name:
          component.label +
          " " +
          addedComponents.filter((c) => c.label === component.label).length,
        id: Math.random().toString(36).substring(7),
      };

      setAddedComponents([...addedComponents, newComponent]);
      setAutoSchedule([
        ...autoSchedule,
        {
          start: null,
          end: null,
          startTime: null,
          endTime: null,
        },
      ]);
    }
  };

  const highlight = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const editName = (id: string, newName: string) => {
    setAddedComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  const deleteComponent = (id: string) => {
    setAddedComponents(addedComponents.filter((c) => c.id !== id));
    setAutoSchedule(
      autoSchedule.filter(
        (_, index) => index !== addedComponents.findIndex((c) => c.id === id)
      )
    );
  };

  const confirmSave = () => {
    console.log("Workflow saved");
    setShowSaveModal(false);
  };

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const handleSave = () => {
    let formattedAutoSchedule = null;
    if (auto && autoSchedule) {
      formattedAutoSchedule = autoSchedule.map((schedule) => {
        const startDate = new Date(
          schedule.start!.year,
          schedule.start!.month - 1, // Months are zero-indexed in JS Date
          schedule.start!.day,
          schedule.startTime?.hour || 0,
          schedule.startTime?.minute || 0
        );

        const endDate = new Date(
          schedule.end!.year,
          schedule.end!.month - 1,
          schedule.end!.day,
          schedule.endTime?.hour || 0,
          schedule.endTime?.minute || 0
        );

        return {
          step: 0,
          start: startDate.getTime(), // Convert to timestamp
          end: endDate.getTime(), // Convert to timestamp
        };
      });
    }

    const componentMap = {
      ATS: "rs",
      "MCQ Assessment": "mcqa",
      "Code Assessment": "ca",
      "MCQ + Code Assessment": "mcqca",
      Assignment: "as",
      Interview: "pi",
    };

    const formattedData = {
      steps: addedComponents.map((component) => {
        return {
          name: component.label, // @ts-expect-error - TS doesn't know the keys of componentMap
          type: componentMap[component.label] as string,
        };
      }),
      currentStep: -1,
      behavior: auto ? "auto" : "manual",
      auto: formattedAutoSchedule,
    };

    axios
      .post("/postings/workflow/create", {
        formattedData,
        _id: window.location.pathname.split("/")[2],
      })
      .then(() => {
        toast.success("Workflow saved successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        toast.error("Failed to save workflow");
        console.error(err);
      });
  };

  return (
    <div className="p-10 w-full h-[92vh]">
      {page === 0 && (
        <div className="gap-10 flex justify-between">
          <div className="w-full flex flex-col gap-5">
            {addedComponents.map((component, index) => (
              <div
                key={index}
                className="border p-5 gap-5 rounded-xl min-h-20 flex justify-start items-center relative"
              >
                <component.icon />
                <div>
                  <div className="flex gap-2 items-center">
                    <input
                      className="border-none outline-none bg-transparent max-w-fit"
                      value={component.name}
                      onChange={(e) => editName(component.id, e.target.value)}
                    />
                  </div>
                  <p className="text-sm opacity-50 mt-2">{component.label}</p>
                </div>
                <Trash
                  className="cursor-pointer absolute right-5 text-red-500"
                  size={14}
                  onClick={() => deleteComponent(component.id)}
                />
                <Edit2 className="cursor-pointer absolute right-12" size={14} />
              </div>
            ))}
            <div
              className="border-4 border-dashed p-5 rounded-xl opacity-50 w-full min-h-20 flex justify-center items-center"
              onDragOver={highlight}
              onDrop={drop}
            >
              + Add Component
            </div>
          </div>
          <Divider orientation="vertical" className="opacity-50" />
          <div className="h-full w-[30%] flex flex-col gap-5 relative">
            {components.map((component, index) => (
              <div
                key={index}
                draggable
                className="p-5 border rounded-xl cursor-pointer hover:bg-gray-800 transition-colors flex items-center gap-5"
                onDragStart={(e) => dragStart(e, component.label)}
              >
                <component.icon />
                {component.label}
              </div>
            ))}
            <Button
              className="w-full mt-5"
              color="success"
              variant="flat"
              onClick={() => setPage(1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {page === 1 && (
        <div className="flex flex-col h-full">
          <div className="mb-5">
            <p className="opacity-50 text-sm mb-5">
              Select the workflow schedule that best fits your hiring process.
              Manual workflows require manual intervention to move candidates to
              the next stage. Automatic workflows move candidates automatically
              to the next stage based on the schedule.
            </p>

            <div className="flex items-center gap-5 justify-center">
              <p>Manual</p>
              <Switch
                checked={auto}
                onChange={() => setAuto(!auto)}
                color="success"
              />
              <p>Automatic</p>
            </div>
          </div>

          {!auto && (
            <div className="flex-grow flex flex-col overflow-hidden">
              <p className="mb-3 text-center">
                Since you are using manual workflows, you can move candidates to
                the next stage manually.
              </p>
            </div>
          )}

          {auto && (
            <div className="flex-grow flex flex-col overflow-hidden">
              <p className="mb-3">Set the schedule for automatic workflows</p>
              <div className="flex-grow overflow-y-auto">
                <div className="flex flex-wrap gap-5 pb-16">
                  {addedComponents.map((component, index) => (
                    <Card className="w-[31%]" key={index}>
                      <CardBody>
                        <div className="flex gap-2 items-center">
                          <p>{component.name}</p>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <DatePicker
                            className="max-w-[284px]"
                            label="Start Date"
                            value={autoSchedule[index]?.start}
                            onChange={(date) => {
                              const newAutoSchedule = [...autoSchedule];
                              newAutoSchedule[index].start = date;
                              setAutoSchedule(newAutoSchedule);
                            }}
                          />
                          <TimeInput
                            label="Start Time"
                            value={autoSchedule[index]?.startTime}
                            onChange={(time) => {
                              const newAutoSchedule = [...autoSchedule];
                              newAutoSchedule[index].startTime = time;
                              setAutoSchedule(newAutoSchedule);
                            }}
                          />
                        </div>

                        <div className="flex gap-2 mt-2">
                          <DatePicker
                            className="max-w-[284px]"
                            label="End Date"
                            value={autoSchedule[index]?.end}
                            onChange={(date) => {
                              const newAutoSchedule = [...autoSchedule];
                              newAutoSchedule[index].end = date;
                              setAutoSchedule(newAutoSchedule);
                            }}
                          />
                          <TimeInput
                            label="End Time"
                            value={autoSchedule[index]?.endTime}
                            onChange={(time) => {
                              const newAutoSchedule = [...autoSchedule];
                              newAutoSchedule[index].endTime = time;
                              setAutoSchedule(newAutoSchedule);
                            }}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-5 justify-between mt-5">
            <Button onClick={() => setPage(0)}>Back</Button>
            <Button onClick={handleSave} color="success" variant="flat">
              Save Workflow
            </Button>
          </div>
        </div>
      )}
      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Save</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to save this workflow?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="success" onClick={confirmSave}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Create;
