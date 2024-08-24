import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";


import { ChevronsUpDown } from "lucide-react";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const workList = ["Full Time", "Part Time", "Intern"];

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");

  const inputFields = [
    { label: "Job Title", description: "Enter the job title" },
    { label: "Department", description: "Enter the department" },
    { label: "Location", description: "Enter the location" },
  ];

  return (
    <Modal
    size="xl"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="opaque"
      classNames={{
        base: "mt-[5vh]",
        wrapper: "items-center",
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <ModalHeader className="flex flex-col px-10 bg-zinc-800/40">
          Create Job Posting
        </ModalHeader>
        <div className="p-2"></div>
        <ModalBody className="flex flex-col space-y-4 px-10">
          {inputFields.map((field, index) => (
            <div key={index} className="w-full">
              <label className="block text-sm font-medium text-white mb-1">
                {field.label}
              </label>
              <Input
                type="text"
                placeholder={field.description}
                value=""
                onChange={() => {}}
                classNames={{
                  base: "w-full",
                  inputWrapper: "w-full",
                  input: "w-full rounded-sm",
                }}
              />
            </div>
          ))}

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">
              Work Type
            </label>
            <Select
              placeholder="Select a work type"
              labelPlacement="outside"
              classNames={{
                base: "w-full",
              }}
              disableSelectorIconRotation
              selectorIcon={<ChevronsUpDown size={16} />}
            >
              {workList.map((type, index) => (
                <SelectItem key={index} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="w-full">
            <Textarea
              label="Expected Skills"
              labelPlacement="outside"
              variant="flat"
              placeholder="List needed skills"
              disableAnimation
              disableAutosize
              classNames={{
                base: "w-full",
                input: "resize-y min-h-[1vh]",
              }}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">
            Salary Range
            </label>
            <div className="flex space-x-2">
              <Textarea
                placeholder="starts at"
                maxRows={1}
              />
              <Textarea
                placeholder="ends at"
                maxRows={1}
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">
              Job Posting Start Date and Time
            </label>
            <div className="flex space-x-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                classNames={{
                  label: "pb-0 text-left",
                  base: "w-1/2",
                  inputWrapper: "mt-1",
                }}
              />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                classNames={{
                  label: "pb-0 text-left",
                  base: "w-1/2",
                  inputWrapper: "mt-1",
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">
              Application Deadline
            </label>
            <div className="flex space-x-2">
              <Input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                classNames={{
                  label: "pb-0 text-left",
                  base: "w-1/2",
                  inputWrapper: "mt-1",
                }}
              />
              <Input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                classNames={{
                  label: "pb-0 text-left",
                  base: "w-1/2",
                  inputWrapper: "mt-1",
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <Textarea
              label="Qualifications/Responsibilities"
              labelPlacement="outside"
              variant="flat"
              placeholder="List needed qualifications and obligations"
              disableAnimation
              disableAutosize
              classNames={{
                base: "w-full",
                input: "resize-y min-h-[1vh]",
              }}
            />
          </div>

          <div className="w-full">
            <Textarea
              label="About"
              labelPlacement="outside"
              variant="flat"
              placeholder="List needed qualifications and obligations"
              disableAnimation
              disableAutosize
              classNames={{
                base: "w-full",
                input: "resize-y min-h-[15vh]",
              }}
            />
          </div>

          <div className="w-full text-xs text-gray-500
          ">
          All fields are required. Once saved and published, only text fields can be edited.
          </div>
        </ModalBody>
        <div className="p-2"></div>
        <ModalFooter className="flex flex-row px-10 bg-zinc-800/40">
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="success" className="">
            Save and Publish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateJobModal;
