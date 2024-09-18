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
  Checkbox,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

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

interface CreateDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDriveModal: React.FC<CreateDriveModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [driveTitle, setDriveTitle] = useState("");
  const [location, setLocation] = useState("");
  const [expectedSkills, setExpectedSkills] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [showSalary, setShowSalary] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [currency, setCurrency] = useState(new Set([]));
  const [about, setAbout] = useState("");

  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const createDrive = () => {
    setLoading(true);
    axios
      .post("/drives/create", {
        title: driveTitle,
        location,
        skills: expectedSkills.split(","),
        salary: {
          min: minSalary,
          max: maxSalary,
          show: showSalary, // @ts-expect-error - idk
          currency: currency.currentKey,
        },
        applicationRange: {
          start: new Date(`${startDate}T${startTime}`),
          end: new Date(`${deadlineDate}T${deadlineTime}`),
        },
        qualifications,
        about,
      })
      .then(() => {
        toast.success("Drive created successfully");
        setLoading(false);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
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
          Create Drive
        </ModalHeader>
        <div className="p-2"></div>
        <ModalBody className="flex flex-col space-y-4 px-10">
          <div className="w-full">
            <Input
              type="text"
              placeholder="Enter the drive title"
              label="Drive Title"
              labelPlacement="outside"
              isRequired
              value={driveTitle}
              onChange={(e) => setDriveTitle(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Input
              type="text"
              placeholder="Enter the location  (Can be remote or physical)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              isRequired
              label="Job Location"
              labelPlacement="outside"
            />
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
              className="w-[60%]"
              selectedKeys={currency} // @ts-expect-error - idk
              onSelectionChange={setCurrency}
              labelPlacement="outside"
            >
              {currencies.map((currency) => (
                <SelectItem key={currency.key}>{currency.label}</SelectItem>
              ))}
            </Select>

            <Checkbox
              checked={showSalary}
              onChange={(e) => setShowSalary(e.target.checked)}
            >
              Show Salary?
            </Checkbox>
          </div>

          <div className="w-full">
            <div className="flex space-x-2">
              <Input
                type="date"
                isRequired
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
                label="Drive Applications Start Date"
                labelPlacement="outside"
              />
              <Input
                type="time"
                isRequired
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
                label="Drive Applications Start Time"
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
                label="Drive Applications Deadline Date"
                labelPlacement="outside"
              />
              <Input
                type="time"
                isRequired
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full"
                label="Drive Applications Deadline Time"
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
              placeholder="Enter a brief description of the drive"
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
            onPress={createDrive}
            isLoading={loading}
          >
            Save and Publish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateDriveModal;
