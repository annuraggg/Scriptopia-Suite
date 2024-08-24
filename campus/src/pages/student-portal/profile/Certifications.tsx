// @ts-nocheck <- add this comment to ignore all type errors
// ! FIX THE TYPES IN THIS FILE ASAP AND REMOVE THIS TWO COMMENTS

import { useState } from 'react';
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Plus, Pencil, ChevronDown, ChevronUp, ExternalLink, Trash } from "lucide-react";

interface Certification {
  issuingOrganization: string;
  name: string;
  issueDate: string;
  expirationDate: string;
  certificateURL: string;
}

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const years = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());

const Certifications = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCertification: Certification = {
      issuingOrganization: formData.get('issuingOrganization') as string,
      name: formData.get('name') as string,
      issueDate: `${formData.get('issueMonth')} ${formData.get('issueYear')}`,
      expirationDate: formData.get('expirationMonth') && formData.get('expirationYear')
        ? `${formData.get('expirationMonth')} ${formData.get('expirationYear')}`
        : "None",
      certificateURL: formData.get('certificateURL') as string,
    };
    setCertifications([...certifications, newCertification]);
    onAddOpenChange();
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedCertification: Certification = {
      issuingOrganization: formData.get('issuingOrganization') as string,
      name: formData.get('name') as string,
      issueDate: `${formData.get('issueMonth')} ${formData.get('issueYear')}`,
      expirationDate: formData.get('expirationMonth') && formData.get('expirationYear')
        ? `${formData.get('expirationMonth')} ${formData.get('expirationYear')}`
        : "None",
      certificateURL: formData.get('certificateURL') as string,
    };
    const updatedCertifications = certifications.map(cert => 
      cert.name === editingCertification?.name ? updatedCertification : cert
    );
    setCertifications(updatedCertifications);
    setEditingCertification(null);
    onEditOpenChange();
  };

  const handleDelete = (name: string) => {
    const filteredCertifications = certifications.filter(cert => cert.name !== name);
    setCertifications(filteredCertifications);
  };

  const displayedCertifications = showAll ? certifications : certifications.slice(0, 2);

  return (
    <>
      <Card className="w-full rounded-xl p-1">
        <CardBody>
          <div className="flex flex-row justify-between items-center mb-3">
            <p className="text-xl text-white">Certifications</p>
            <Button size="sm" variant="ghost" className="text-white mr-2 border-none" onPress={onAddOpen}>
              <Plus size={16} />
              add
            </Button>
          </div>
          <div className="mb-3 bg-gray-700 w-[100%] h-[1px] justify-center items-center rounded-full"></div>
          {displayedCertifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">{cert.issuingOrganization}</p>
                  <p className="text-sm text-white font-semibold">{cert.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Issued: {cert.issueDate} • Expiration: {cert.expirationDate}
                  </p>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="mt-2 text-white"
                    as="a"
                    href={cert.certificateURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Certificate <ExternalLink size={14} className="ml-1" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white border-none" 
                    onPress={() => {
                      setEditingCertification(cert);
                      onEditOpen();
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-500 border-none" 
                    onPress={() => handleDelete(cert.name)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {certifications.length > 2 && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="w-full mt-2 text-gray-400"
              onPress={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Show less <ChevronUp size={14} className="ml-1" />
                </>
              ) : (
                <>
                  Show all {certifications.length} Certifications <ChevronDown size={14} className="ml-1" />
                </>
              )}
            </Button>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isAddOpen} onOpenChange={onAddOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleAddSubmit}>
              <ModalHeader className="flex flex-col gap-1">Add Certification</ModalHeader>
              <ModalBody>
                <Input
                  label="Issuing Authority"
                  placeholder="Enter issuing authority"
                  name="issuingAuthority"
                  required
                />
                <Input
                  label="Name"
                  placeholder="Enter certification name"
                  name="name"
                  required
                />
                <div className="flex gap-2">
                  <Select label="Issue Month" name="issueMonth" required>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </Select>
                  <Select label="Issue Year" name="issueYear" required>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Select label="Expiration Month" name="expirationMonth">
                    <SelectItem key="none" value="">None</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </Select>
                  <Select label="Expiration Year" name="expirationYear">
                    <SelectItem key="none" value="">None</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </Select>
                </div>
                <Input
                  label="Add certificate URL"
                  placeholder="Enter certificate URL"
                  name="certificateURL"
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

      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleEditSubmit}>
              <ModalHeader className="flex flex-col gap-1">Edit Certification</ModalHeader>
              <ModalBody>
                <Input
                  label="Issuing Authority"
                  placeholder="Enter issuing authority"
                  name="issuingAuthority"
                  defaultValue={editingCertification?.issuingOrganization}
                  required
                />
                <Input
                  label="Name"
                  placeholder="Enter certification name"
                  name="name"
                  defaultValue={editingCertification?.name}
                  required
                />
                <div className="flex gap-2">
                  <Select label="Issue Month" name="issueMonth" required defaultValue={editingCertification?.issueDate.split(' ')[0]}>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </Select>
                  <Select label="Issue Year" name="issueYear" required defaultValue={editingCertification?.issueDate.split(' ')[1]}>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Select label="Expiration Month" name="expirationMonth" defaultValue={editingCertification?.expirationDate.split(' ')[0] !== 'None' ? editingCertification?.expirationDate.split(' ')[0] : ""}>
                    <SelectItem key="none" value="">None</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </Select>
                  <Select label="Expiration Year" name="expirationYear" defaultValue={editingCertification?.expirationDate.split(' ')[1] !== 'None' ? editingCertification?.expirationDate.split(' ')[1] : ""}>
                    <SelectItem key="none" value="">None</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </Select>
                </div>
                <Input
                  label="Add certificate URL"
                  placeholder="Enter certificate URL"
                  name="certificateURL"
                  defaultValue={editingCertification?.certificateURL}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Certifications;
