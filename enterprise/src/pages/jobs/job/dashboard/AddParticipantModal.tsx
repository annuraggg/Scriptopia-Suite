import React from 'react';
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";


interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: string;
  newParticipant: {
    name: string;
    email: string;
    phone: string;
  };
  setNewParticipant: React.Dispatch<React.SetStateAction<{ name: string; email: string; phone: string }>>;
  handleSubmitParticipant: () => void;
}

const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  isOpen,
  onClose,
  currentStage,
  newParticipant,
  setNewParticipant,
  handleSubmitParticipant,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Add Participant to {currentStage}</ModalHeader>
        <ModalBody>
          <Input
            label="Name"
            value={newParticipant.name}
            onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
          />
          <Input
            label="Email"
            value={newParticipant.email}
            onChange={(e) => setNewParticipant({...newParticipant, email: e.target.value})}
          />
          <Input
            label="Phone"
            value={newParticipant.phone}
            onChange={(e) => setNewParticipant({...newParticipant, phone: e.target.value})}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmitParticipant}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddParticipantModal;
