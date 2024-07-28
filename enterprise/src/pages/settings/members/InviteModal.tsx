import { useState } from "react";
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
} from "@nextui-org/react";
import { Member } from "@/@types/Organization";
import Role from "@/@types/Roles";

const InviteModal = ({
  isOpen,
  onOpenChange,
  onInvite,
  roles,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (newMember: Member) => void;
  roles: Role[];
}) => {
  const [email, setEmail] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<Role>({} as Role);

  const handleInvite = () => {
    if (email && selectedRole) {
      const currentDate = new Date().toLocaleDateString("en-GB");
      onInvite({ email, role: selectedRole, addedOn: currentDate });
      setEmail("");
      setSelectedRole({} as Role);
      onOpenChange(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Invite Member</ModalHeader>
            <ModalBody>
              <Input
                label="Email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select
                label="Role"
                placeholder="Select a role"
                selectedKeys={selectedRole._id ? [selectedRole._id] : []}
                onSelectionChange={(keys) =>
                  setSelectedRole( // @ts-expect-error - shutup
                    roles.find((role) => role._id === keys[0] as string) || ({} as Role)
                  )
                }
              >
                {roles.map((role) => (
                  <SelectItem key={role.name} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="success" onPress={handleInvite} variant="flat">
                Invite
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
