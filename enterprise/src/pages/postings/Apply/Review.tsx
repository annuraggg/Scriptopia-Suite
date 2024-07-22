import { useState } from "react";
import { EditIcon, Paperclip } from "lucide-react";
import {
  Textarea,
  Checkbox,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

interface ReviewProps {
  onEdit: (section: string) => void;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  email: string;
  website: string;
  resume: File | null;
  query: string;
}

const Review = ({
  onEdit,
  firstName,
  lastName,
  countryCode,
  phone,
  email,
  website,
  resume,
  query,
}: ReviewProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSubmit = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-col items-start justify-start w-full gap-6 pb-10">
      <div className="flex flex-col items-start justify-start gap-6 w-full h-[40%] flex-reverse">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          <p className="text-2xl">Contact Information</p>
          <div
            className="flex flex-row gap-1 items-center  text-green-500 cursor-pointer"
            onClick={() => onEdit("contact")}
          >
            <EditIcon size={14} />
            <p className="text-sm mt-1">Edit</p>
          </div>
        </div>
        <div className="flex flex-col-2 w-[50%] gap-5 text-base">
          <div className="space-y-3 text-default-500">
            <p>Name:</p>
            <p>Phone No:</p>
            <p>Email Address:</p>
            <p>Website:</p>
          </div>
          <div className="space-y-3">
            <p>
              {firstName} {lastName}
            </p>
            <p>
              {countryCode} {phone}
            </p>
            <p>{email}</p>
            <p>{website}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-[0.5px] bg-slate-500 justify-start rounded-full"></div>
      <div className="flex flex-col items-start justify-start my-1 w-full h-[40%] flex-reverse">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          <p className="text-2xl">Resume</p>
          <div
            className="flex flex-row gap-1 items-center justify-start text-green-500 cursor-pointer"
            onClick={() => onEdit("resume")}
          >
            <EditIcon size={14} />
            <p className="text-sm mt-1">Edit</p>
          </div>
        </div>
        <div className="flex flex-col-2 w-[50%] h-full gap-5 text-base">
          <div className="mt-5 flex items-center gap-3">
            <Paperclip size={20} />
            <p>{resume?.name}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-[0.5px] bg-slate-500 justify-start rounded-full"></div>
      <div className="flex flex-col items-start justify-start gap-6 w-full h-full flex-reverse">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          <p className="text-2xl">Additional Questions</p>
          <div
            className="flex flex-row gap-1 items-center justify-start text-green-500 cursor-pointer"
            onClick={() => onEdit("additional")}
          >
            <EditIcon size={14} />
            <p className="text-sm mt-1">Edit</p>
          </div>
        </div>
        <div className="flex flex-col-2 w-[50%] h-full gap-5 text-base">
          <div className="space-y-3 text-default-500">
            <p>Question 1:</p>
            <p>Question 2:</p>
            <p>Question 3:</p>
          </div>
          <div className="space-y-3">
            <p>Answer 1</p>
            <p>Answer 2</p>
            <p>Answer 3</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start w-full h-full gap-2">
          <p className="text-base text-default-500">
            Do You Have Any Questions ?
          </p>
          <Textarea
            isDisabled
            value={query}
            placeholder="Nothing Here"
            className=" rounded-none text-base"
          />
        </div>
      </div>
      <div className="w-full h-[0.5px] bg-default-400 justify-start rounded-full"></div>
      <div className="flex flex-col items-start justify-start gap-6 w-full h-[40%]">
        <div className="flex flex-row items-center justify-start w-full gap-2">
          <Checkbox
            radius="sm"
            isSelected={isSelected}
            onValueChange={setIsSelected}
          ></Checkbox>
          <p className="text-sm mt-2 w-[80%]">
            I confirm that the details I am submitting are accurate and valid. I
            understand that providing incorrect information may result in
            disqualification and further action.
          </p>
          {isSelected && (
            <Button onPress={handleSubmit} className="bg-sky-500 text-sky-900">
              Submit
            </Button>
          )}
        </div>
      </div>
      <Modal isOpen={isModalVisible} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>
            <h1>Congratulations!</h1>
          </ModalHeader>
          <ModalBody>
            <p>Your application has been submitted successfully.</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Review;
