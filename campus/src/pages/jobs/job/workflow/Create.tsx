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
  DateInput,
  Divider,
  TimeInput,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";

const Create = () => {
  const { isOpen, onOpenChange } = useDisclosure();

  const [addedComponents, setAddedComponents] = useState<
    { icon: React.Component; label: string; name: string; id: string }[]
  >([]);

  const [auto, setAuto] = useState(false);

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

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'innerText' does not exist on type 'EventTarget'.
    e.dataTransfer.setData("text", e.target.innerText);
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'icon' does not exist on type 'string'.
    const component: {
      icon: React.Component;
      label: string;
      name: string;
      id: string;
    } = components.find((c) => c.label === data);

    component.name =
      component.label +
      " " +
      addedComponents.filter((c) => c.label === component.label).length;
    component.id = Math.random().toString(36).substring(7);

    setAddedComponents([...addedComponents, component]);
  };

  const highlight = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const editName = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentTarget' does not exist on type 'EventTarget'.
    const input = e.currentTarget.parentElement.querySelector("input");
    input?.removeAttribute("disabled");
    input?.focus();
    input?.addEventListener("blur", () => {
      input.setAttribute("disabled", "true");
    });
  };

  const updateName = (id: string) => {
    const input = document.getElementById(
      `input-${addedComponents.findIndex((c) => c.id === id)}`
    );
    const component = addedComponents.find((c) => c.id === id);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'HTMLElement'.
    component.name = input?.value || "";

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'setAddedComponents' does not exist on type 'never'.
    setAddedComponents((prev) =>
      prev.map((c) => (c.id === id ? component : c))
    );
  };

  const deleteComponent = (id: string) => {
    const newComponents = addedComponents.filter((c) => c.id !== id);
    setAddedComponents(newComponents);
  };

  const save = () => {};

  return (
    <div className="p-10 w-full gap-10 flex justify-between h-[92vh]">
      <div className="w-full flex flex-col gap-5">
        {addedComponents.map((component, index) => (
          <div
            key={index}
            className="border p-5 gap-5 rounded-xl min-h-20 flex justify-start items-center relative"
          >
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'icon' does not exist on type 'string'. */}
            <component.icon />
            <div>
              <div className="flex gap-2 items-center">
                <input
                  className="border-none outline-none bg-transparent max-w-fit"
                  value={component.name}
                  disabled
                  onChange={() => updateName(component.id)}
                  id={`input-${index}`}
                />
              </div>
              <p className="text-sm opacity-50 mt-2">{component.label}</p>
            </div>
            <Trash
              className="cursor-pointer absolute right-5 text-red-500"
              size={14}
              onClick={() => deleteComponent(component.id)}
            />
            <Edit2
              className=" cursor-pointer absolute right-12"
              size={14}
              onClick={editName}
            />
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
            onDragStart={dragStart}
          >
            <component.icon />
            {component.label}
          </div>
        ))}
        <Button
          className="justify-self-end bottom-0 absolute w-full"
          color="success"
          variant="flat"
          onClick={() => onOpenChange()}
        >
          Next
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choose Workflow Schedule
              </ModalHeader>
              <ModalBody>
                <p className="opacity-50 text-sm">
                  Select the workflow schedule that best fits your hiring
                  process. Manual workflows require manual intervention to move
                  candidates to the next stage. Automatic workflows move
                  candidates automatically to the next stage based on the
                  schedule.
                </p>

                <div className="flex items-center gap-5 mt-5 justify-center">
                  <p>Manual</p>
                  <Switch
                    checked={auto}
                    onChange={() => setAuto(!auto)}
                    color="success"
                  />
                  <p>Automatic</p>
                </div>

                {auto && (
                  <div className="flex flex-col gap-5 mt-5">
                    <p>Set the schedule for automatic workflows</p>
                    <div className="flex flex-wrap gap-5">
                      {addedComponents.map((component, index) => (
                        <Card className="w-[31%]" key={index}>
                          <CardBody>
                            <div className="flex gap-2 items-center">
                              <p>{component.name}</p>
                            </div>

                            <div className="flex gap-2">
                              <DateInput
                                className="mt-2"
                                label="Start Date"
                                labelPlacement="outside"
                              />
                              <TimeInput
                                className="mt-2"
                                label="Start Time"
                                labelPlacement="outside"
                              />
                            </div>

                            <div className="flex gap-2 mt-2">
                              <DateInput
                                className="mt-2"
                                label="End Date"
                                labelPlacement="outside"
                              />
                              <TimeInput
                                className="mt-2"
                                label="End Time"
                                labelPlacement="outside"
                              />
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save Workflow
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
