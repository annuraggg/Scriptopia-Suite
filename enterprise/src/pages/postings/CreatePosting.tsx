import React, { useState } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import { Building2Icon, CalendarIcon, ClockIcon } from "lucide-react";

const CreateJob: React.FC = () => {
  const [postingName, setPostingName] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const generateLink = () => {
    const randomString = Math.random().toString(36).substring(7);
    setGeneratedLink(`https://scriptopia.enterprise.com/apply/${randomString}`);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const getStatus = () => {
    if (!selectedDate || !selectedTime) return "Not set";
    const now = new Date();
    const closingDate = new Date(`${selectedDate}T${selectedTime}`);
    return closingDate > now ? "Active" : "Inactive";
  };

  const handleCreatePosting = () => {
    const newPosting = {
      title: postingName,
      createdOn: new Date().toLocaleDateString(),
      status: getStatus() as 'Active' | 'Inactive',
      openUntil: `${selectedDate} ${selectedTime}`,
    };
    
   
    const existingPostings = JSON.parse(localStorage.getItem('postings') || '[]');
    const updatedPostings = [...existingPostings, newPosting];
    localStorage.setItem('postings', JSON.stringify(updatedPostings));

   
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
   
    setPostingName('');
    setSelectedDate('');
    setSelectedTime('');
    setGeneratedLink('');
  };

  return (
    <div className="flex flex-col items-center justify-center p-14 h-screen">
      <Card className="w-[50%] h-full p-6 rounded-3xl bg-gray-500 bg-opacity-5">
        <CardHeader className="flex flex-row items-between justify-start gap-3">
          <Building2Icon size={46} className="mr-2" />
          <div className="">
            <p className="text-2xl font-bold">Create Posting</p>
            <p className="text-ls text-gray-500">Open a Posting for a Job Role</p>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col pt-8 gap-4">
          <div>
            <label className="text-base text-gray-400">Posting Name</label>
            <Input 
              placeholder="Name" 
              className="mt-2" 
              value={postingName}
              onChange={(e) => setPostingName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-base text-gray-400">Posting Open Until</label>
            <div className="flex gap-2 mt-2 w-[45%]">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="bordered" 
                    startContent={<CalendarIcon size={18} />}
                  >
                    {selectedDate || "Select a date"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu className=''>
                  {["2024-07-18", "2024-07-19", "2024-07-20", "2024-07-21", "2024-07-22"].map((date) => (
                    <DropdownItem key={date} onClick={() => handleDateSelect(date)}>
                      {date}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Input
                type="time"
                placeholder="Select time"
                value={selectedTime}
                onChange={handleTimeChange}
                startContent={<ClockIcon size={18} />}
              />
            </div>
          </div>

          <Button color="primary" onClick={generateLink}>
            Generate Application Link
          </Button>

          {generatedLink && (
            <div>
              <label className="text-base text-gray-400">Application Link</label>
              <Input 
                readOnly 
                value={generatedLink} 
                className="mt-2" 
              />
            </div>
          )}

          <Table aria-label="Posting Details" className="border">
            <TableHeader>
              <TableColumn>DETAIL</TableColumn>
              <TableColumn>VALUE</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>Status</TableCell>
                <TableCell>{getStatus()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button 
            color="success" 
            onClick={handleCreatePosting}
            disabled={!postingName || !selectedDate || !selectedTime || !generatedLink}
          >
            Create Posting
          </Button>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Job Created Successfully</ModalHeader>
          <ModalBody>
            <p>Your job posting "{postingName}" has been created successfully.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CreateJob