import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Department } from "@shared-types/Organization";
const currencies = [
  { key: "usd", label: "USD $" },
  { key: "eur", label: "EUR €" },
  { key: "gbp", label: "GBP £" },
  { key: "inr", label: "INR ₹" },
  { key: "jpy", label: "JPY ¥" },
  { key: "aud", label: "AUD A$" },
  { key: "cad", label: "CAD C$" },
  { key: "chf", label: "CHF Fr" },
  { key: "cny", label: "CNY ¥" },
  { key: "sek", label: "SEK kr" },
  { key: "nzd", label: "NZD $" },
  { key: "mxn", label: "MXN $" },
  { key: "sgd", label: "SGD $" },
  { key: "hkd", label: "HKD $" },
  { key: "nok", label: "NOK kr" },
  { key: "krw", label: "KRW ₩" },
  { key: "try", label: "TRY ₺" },
  { key: "rub", label: "RUB ₽" },
  { key: "brl", label: "BRL R$" },
  { key: "zar", label: "ZAR R" },
];

interface createJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  deparments: Department[];
}

const CreateJobModal: React.FC<createJobModalProps> = ({
  isOpen,
  onClose,
  deparments,
}) => {
  const [jobTitle, setjobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [expectedSkills, setExpectedSkills] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [currency, setCurrency] = useState(new Set([]));
  const [department, setDepartment] = useState(new Set([]));
  const [jobType, setJobType] = useState(new Set([]));
  const [about, setAbout] = useState("");
  const [openings, setOpening] = useState("");

  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const createJob = () => {
    setLoading(true);
    axios
      .post("/postings/create", {
        title: jobTitle,
        description: about, // @ts-expect-error - idk
        department: department.currentKey,
        openings,
        location, // @ts-expect-error - idk
        type: jobType.currentKey,
        salary: {
          min: minSalary,
          max: maxSalary, // @ts-expect-error - idk
          currency: currency.currentKey,
        },
        applicationRange: {
          start: new Date(`${startDate}T${startTime}`),
          end: new Date(`${deadlineDate}T${deadlineTime}`),
        },
        skills: expectedSkills.split(","),

        qualifications,
      })
      .then(() => {
        toast.success("job created successfully");
        setLoading(false);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data);
        setLoading(false);
      });
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col px-10 bg-zinc-800/40">
          Create job
        </ModalHeader>
        <div className="p-2"></div>
        <ModalBody className="flex flex-col space-y-4 px-10">
          <div className="w-full">
            <Input
              type="text"
              placeholder="Enter the job title"
              label="job Title"
              labelPlacement="outside"
              isRequired
              value={jobTitle}
              onChange={(e) => setjobTitle(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-3">
            <Input
              type="number"
              placeholder="Enter the number of openings"
              label="Number of Openings"
              labelPlacement="outside"
              isRequired
              value={openings}
              onChange={(e) => setOpening(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Select
              label="Department"
              placeholder="Select department"
              selectedKeys={department} // @ts-expect-error - idk
              onSelectionChange={setDepartment}
              labelPlacement="outside"
            >
              {deparments.map((department) => (
                <SelectItem key={department.name}>{department.name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-full flex gap-3">
            <Input
              type="text"
              placeholder="Enter the location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              isRequired
              label="Job Location"
              labelPlacement="outside"
            />

            <Select
              label="Job Type"
              placeholder="Select job type"
              className="max-w-xs"
              labelPlacement="outside"
              selectedKeys={jobType} // @ts-expect-error - idk
              onSelectionChange={(e) => setJobType(e)}
            >
              <SelectItem key={"part_time"}>Part Time</SelectItem>
              <SelectItem key={"full_time"}>Full Time</SelectItem>
              <SelectItem key={"internship"}>Internship</SelectItem>
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
              isRequired
              value={expectedSkills}
              onChange={(e) => setExpectedSkills(e.target.value)}
            />
          </div>

          <div className="w-full">
            <div className="flex space-x-2">
              <Textarea
                placeholder="starts at"
                maxRows={1}
                isRequired
                label="Minimum Salary"
                labelPlacement="outside"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
              <Textarea
                placeholder="ends at"
                maxRows={1}
                isRequired
                label="Maximum Salary"
                labelPlacement="outside"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full flex items-end justify-between">
            <Select
              label="Currency"
              placeholder="Select currency"
              selectedKeys={currency} // @ts-expect-error - idk
              onSelectionChange={setCurrency}
              labelPlacement="outside"
            >
              {currencies.map((currency) => (
                <SelectItem key={currency.key}>{currency.label}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="w-full">
            <div className="flex space-x-2">
              <Input
                type="date"
                isRequired
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
                label="job Applications Start Date"
                labelPlacement="outside"
              />
              <Input
                type="time"
                isRequired
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
                label="job Applications Start Time"
                labelPlacement="outside"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="flex space-x-2">
              <Input
                type="date"
                isRequired
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full"
                label="job Applications Deadline Date"
                labelPlacement="outside"
              />
              <Input
                type="time"
                isRequired
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full"
                label="job Applications Deadline Time"
                labelPlacement="outside"
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
              isRequired
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
            />
          </div>

          <div className="w-full">
            <Textarea
              label="About"
              labelPlacement="outside"
              variant="flat"
              placeholder="Enter a brief description of the job"
              disableAnimation
              disableAutosize
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              isRequired
            />
          </div>

          <div
            className="w-full text-xs text-gray-500
          "
          >
            All fields are required. Once saved and published, only text fields
            can be edited.
          </div>
        </ModalBody>
        <div className="p-2"></div>
        <ModalFooter className="flex flex-row px-10 bg-zinc-800/40">
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
            isDisabled={loading}
          >
            Close
          </Button>
          <Button
            color="success"
            className=""
            onPress={createJob}
            isLoading={loading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateJobModal;
