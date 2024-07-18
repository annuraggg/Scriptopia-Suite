import React, { useState } from "react";
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    Input, 
    Select, 
    SelectItem 
} from "@nextui-org/react";

interface InvitedMember {
    email: string;
    invited: string;
    role: string;
}

interface Role {
    role: string;
}

interface InviteModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onInvite: (member: InvitedMember) => void;
    roles: Role[];
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onOpenChange, onInvite, roles }) => {
    const [email, setEmail] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("");

    const handleInvite = () => {
        if (email && selectedRole) {
            const currentDate = new Date().toLocaleDateString('en-GB');
            onInvite({ email, role: selectedRole, invited: currentDate });
            setEmail("");
            setSelectedRole("");
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
                                selectedKeys={selectedRole ? [selectedRole] : []}
                                onSelectionChange={(keys) => setSelectedRole(Array.from(keys)[0] as string)}
                            >
                                {roles.map((role) => (
                                    <SelectItem key={role.role} value={role.role}>
                                        {role.role}
                                    </SelectItem>
                                ))}
                            </Select>
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