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
import { Member } from "@shared-types/Institute";
import { Role } from "@shared-types/EnterpriseRole";

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
      const currentDate = new Date();
      onInvite({ email, role: selectedRole.name, addedOn: currentDate, status: "pending" });
      setEmail("");
      setSelectedRole(roles[0]);
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
                selectedKeys={[selectedRole.name]}
                onSelectionChange={(keys) => {
                  if (keys.currentKey === null) return;

                  setSelectedRole( // @ts-expect-error - shutup
                    roles.find((role) => role.name === keys.currentKey)
                  );
                }}
              >
                {roles.map((role) => (
                  <SelectItem key={role.name} value={role.name}>
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
