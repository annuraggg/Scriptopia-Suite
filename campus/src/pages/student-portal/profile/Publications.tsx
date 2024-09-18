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
} from "@nextui-org/react";
import { Plus, Pencil, ChevronDown, ChevronUp, ExternalLink, Trash } from "lucide-react";

interface Publication {
  title: string;
  publicationPublisher: string;
  publicationDate: string;
  authors: string;
  publicationURL: string;
}

const Publications = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPublication: Publication = {
      title: formData.get('title') as string,
      publicationPublisher: formData.get('publicationPublisher') as string,
      publicationDate: formData.get('publicationDate') as string,
      authors: formData.get('authors') as string,
      publicationURL: formData.get('publicationURL') as string,
    };
    setPublications([...publications, newPublication]);
    onAddOpenChange();
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedPublication: Publication = {
      title: formData.get('title') as string,
      publicationPublisher: formData.get('publicationPublisher') as string,
      publicationDate: formData.get('publicationDate') as string,
      authors: formData.get('authors') as string,
      publicationURL: formData.get('publicationURL') as string,
    };
    const updatedPublications = publications.map(pub => 
      pub.title === editingPublication?.title ? updatedPublication : pub
    );
    setPublications(updatedPublications);
    setEditingPublication(null);
    onEditOpenChange();
  };

  const handleDelete = (title: string) => {
    const filteredPublications = publications.filter(pub => pub.title !== title);
    setPublications(filteredPublications);
  };

  const displayedPublications = showAll ? publications : publications.slice(0, 1);

  return (
    <>
      <Card className="w-full rounded-xl p-1">
        <CardBody>
          <div className="flex flex-row justify-between items-center mb-3">
            <p className="text-xl text-white">Publications</p>
            <Button size="sm" variant="ghost" className="text-white mr-2 border-none" onPress={onAddOpen}>
              <Plus size={16} />
              add
            </Button>
          </div>
          <div className="mb-3 bg-gray-700 w-[100%] h-[1px] justify-center items-center rounded-full"></div>
          {displayedPublications.map((pub, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white font-semibold">{pub.title}</p>
                  <p className="text-sm text-gray-400">{pub.publicationPublisher}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {pub.publicationDate} • {pub.authors}
                  </p>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="mt-2 text-white"
                    as="a"
                    href={pub.publicationURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Publication <ExternalLink size={14} className="ml-1" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white border-none" 
                    onPress={() => {
                      setEditingPublication(pub);
                      onEditOpen();
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-500 border-none" 
                    onPress={() => handleDelete(pub.title)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {publications.length > 1 && (
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
                  Show all {publications.length} Publications <ChevronDown size={14} className="ml-1" />
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
              <ModalHeader className="flex flex-col gap-1">Add Publication</ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  placeholder="Enter publication title"
                  name="title"
                  required
                />
                <Input
                  label="Publication/Publisher"
                  placeholder="Enter publication or publisher name"
                  name="publicationPublisher"
                  required
                />
                <Input
                  label="Publication Date"
                  placeholder="dd/mm/yyyy"
                  name="publicationDate"
                  required
                />
                <Input
                  label="Authors"
                  placeholder="Name of all authors (comma separated)"
                  name="authors"
                  required
                />
                <Input
                  label="Publication URL"
                  placeholder="Enter publication URL"
                  name="publicationURL"
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
              <ModalHeader className="flex flex-col gap-1">Edit Publication</ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  placeholder="Enter publication title"
                  name="title"
                  defaultValue={editingPublication?.title}
                  required
                />
                <Input
                  label="Publication/Publisher"
                  placeholder="Enter publication or publisher name"
                  name="publicationPublisher"
                  defaultValue={editingPublication?.publicationPublisher}
                  required
                />
                <Input
                  label="Publication Date"
                  placeholder="dd/mm/yyyy"
                  name="publicationDate"
                  defaultValue={editingPublication?.publicationDate}
                  required
                />
                <Input
                  label="Authors"
                  placeholder="Name of all authors (comma separated)"
                  name="authors"
                  defaultValue={editingPublication?.authors}
                  required
                />
                <Input
                  label="Publication URL"
                  placeholder="Enter publication URL"
                  name="publicationURL"
                  defaultValue={editingPublication?.publicationURL}
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

export default Publications;