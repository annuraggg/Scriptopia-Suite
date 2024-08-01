import React, { useState } from 'react';
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
} from '@nextui-org/react';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const workTypes = ["Full Time", "Part Time", "Intern"];

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');

  const inputFields = [
    { label: "Job Title", description: "Enter the job title" },
    { label: "Department", description: "Enter the department" },
    { label: "Location", description: "Enter the location" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={{
        base: "mt-[5vh]",
        wrapper: "items-center",
      }}
    >
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <ModalHeader>Create Job Posting</ModalHeader>
        <ModalBody className='flex flex-col space-y-4'>
          {inputFields.map((field, index) => (
            <div key={index} className="w-full">
              <Input
                type="text"
                label={field.label}
                labelPlacement="outside"
                description={field.description}
                value=""
                onChange={() => {}}
                classNames={{
                  label: "pb-0 text-left",
                  base: "w-full",
                  inputWrapper: "mt-1"
                }}
              />
            </div>
          ))}
          <div className="w-full">
            <Select
              labelPlacement="outside"
              label="Work Type"
              classNames={{
                label: "pb-0 text-left",
                base: "w-full",
                trigger: "mt-1"
              }}
            >
              {workTypes.map((type, index) => (
                <SelectItem key={index} value={type}>{type}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col w-full h-full gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-left">Job Posting Start</label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  label="Date"
                  labelPlacement="outside"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  classNames={{
                    label: "pb-0 text-left",
                    base: "w-1/2",
                    inputWrapper: "mt-1"
                  }}
                />
                <Input
                  type="time"
                  label="Time"
                  labelPlacement="outside"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  classNames={{
                    label: "pb-0 text-left",
                    base: "w-1/2",
                    inputWrapper: "mt-1"
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-left">Application Deadline</label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  label="Date"
                  labelPlacement="outside"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  classNames={{
                    label: "pb-0 text-left",
                    base: "w-1/2",
                    inputWrapper: "mt-1"
                  }}
                />
                <Input
                  type="time"
                  label="Time"
                  labelPlacement="outside"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  classNames={{
                    label: "pb-0 text-left",
                    base: "w-1/2",
                    inputWrapper: "mt-1"
                  }}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={onClose}>
            Close
          </Button>
          <Button color="primary">
            Create Job
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateJobModal;
