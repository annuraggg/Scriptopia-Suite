import { useState } from 'react';
import {
  Card,
  CardBody,
  Button,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react"
import { FilePenLine } from "lucide-react"

interface ContactInfo {
  email: string;
  phoneCode: string;
  phoneNumber: string;
  linkedIn: string;
  website: string;
}

const countryCodes = [
  { label: "USA (+1)", value: "+1" },
  { label: "UK (+44)", value: "+44" },
  { label: "India (+91)", value: "+91" },
  { label: "Australia (+61)", value: "+61" },
  { label: "Canada (+1)", value: "+1" },
];

const Contact = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'd.man1562001@gmail.com',
    phoneCode: '+91',
    phoneNumber: '9876543210',
    linkedIn: '',
    website: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newContactInfo = {
      email: formData.get('email') as string,
      phoneCode: formData.get('phoneCode') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      linkedIn: formData.get('linkedIn') as string,
      website: formData.get('website') as string,
    };
    setContactInfo(newContactInfo);
    onOpenChange();
  };

  return (
    <>
      <Card className="w-full h-38 rounded-xl p-1">
        <CardBody>
          <div className="flex flex-row justify-between items-center">
            <p className="text-xl">Contact</p>
            <Button size="sm" variant="ghost" className="flex flex-row border-none" onPress={onOpen}>
              <FilePenLine size={16} />
              Edit
            </Button>
          </div>
          <div className="mt-2 bg-gray-700 w-[100%] h-[1px] justify-center items-center rounded-full"></div>
          <div className="flex w-full h-full mt-3">
            <div className="flex flex-col w-[40%] text-sm gap-2">
              <p className="w-full">Email</p>
              <p className="w-full">Phone</p>
              <p className="w-full">LinkedIn</p>
              {contactInfo.website && <p className="w-full">Website</p>}
            </div>
            <div className="flex flex-col w-[60%] text-sm gap-2">
              <Link showAnchorIcon className="w-full text-sm">{contactInfo.email}</Link>
              <p className="w-full">{`${contactInfo.phoneCode} ${contactInfo.phoneNumber}`}</p>
              {contactInfo.linkedIn && (
                <Link href={contactInfo.linkedIn} showAnchorIcon className="w-full text-sm" target="_blank" rel="noopener noreferrer">
                  Connect
                </Link>
              )}
              {contactInfo.website && (
                <Link href={contactInfo.website} showAnchorIcon className="w-full text-sm" target="_blank" rel="noopener noreferrer">
                  Website
                </Link>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">Edit Contact Information</ModalHeader>
              <ModalBody>
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  name="email"
                  defaultValue={contactInfo.email}
                />
                <div className="flex gap-2">
                  <Select
                    label="Country Code"
                    placeholder="Select country code"
                    name="phoneCode"
                    defaultSelectedKeys={[contactInfo.phoneCode]}
                    className="w-1/3"
                  >
                    {countryCodes.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    name="phoneNumber"
                    defaultValue={contactInfo.phoneNumber}
                    className="w-2/3"
                  />
                </div>
                <Input
                  label="LinkedIn"
                  placeholder="Enter your LinkedIn profile link"
                  name="linkedIn"
                  defaultValue={contactInfo.linkedIn}
                />
                <Input
                  label="Website"
                  placeholder="Enter your website URL"
                  name="website"
                  defaultValue={contactInfo.website}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Save
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Contact