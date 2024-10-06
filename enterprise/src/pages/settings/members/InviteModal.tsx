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
import { Member } from "@shared-types/Organization";
import { Role } from "@shared-types/Organization";

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
  const [error, setError] = useState<string>("");

  const handleInvite = () => {
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!selectedRole || !selectedRole.name) {
      setError("Please select a role.");
      return;
    }

    const currentDate = new Date();
    onInvite({
      email,
      role: selectedRole,
      addedOn: currentDate,
      status: "pending",
    });
    
    setEmail("");
    setSelectedRole(roles[0]);
    setError("");
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "max-w-md",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Invite Member</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Email"
                placeholder="Enter member's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                classNames={{
                  input: "bg-gray-100",
                  label: "text-gray-600",
                }}
              />
              <Select
                label="Role"
                placeholder="Select a role"
                selectedKeys={selectedRole ? [selectedRole.name] : []}
                onChange={(e) => {
                  const selectedKey = e.target.value;
                  const role = roles.find((r) => r.name === selectedKey);
                  setSelectedRole(role || ({} as Role));
                }}
                classNames={{
                  trigger: "",
                  label: "text-gray-600",
                }}
              >
                {roles.map((role) => (
                  <SelectItem key={role.name} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </Select>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleInvite}>
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
