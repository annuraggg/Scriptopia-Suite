import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Table,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
    TableColumn,
    useDisclosure
} from "@nextui-org/react";
import React, { useState } from "react";
import { Building2Icon, Trash2Icon } from "lucide-react";
import InviteModal from "../settings/InviteModal";

interface InvitedMember {
    email: string;
    invited: string;
    role: string;
}

interface Role {
    role: string;
}

const CreateOrganization: React.FC = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);
    const roles: Role[] = [
        { role: "Admin" },
        { role: "Hiring Manager" },
        { role: "Finance" },
        { role: "Read Only" },
    ];

    const handleInvite = (member: InvitedMember) => {
        setInvitedMembers([...invitedMembers, member]);
    };

    const handleDeleteInvitedMember = (index: number) => {
        const updatedMembers = invitedMembers.filter((_, i) => i !== index);
        setInvitedMembers(updatedMembers);
    };

    return (
        <div className="flex flex-col items-center justify-center p-14 h-screen">
            <Card className="w-[50%] h-full p-6 rounded-3xl bg-gray-500 bg-opacity-5">
                <CardHeader className="flex flex-row items-between justify-start gap-3">
                    <Building2Icon size={46} className="mr-2" />
                    <div className="">
                        <p className="text-2xl font-bold">Create Organization</p>
                        <p className="text-ls text-gray-500">Give a Identity to your Organization and Invite Members assign them Roles</p>
                    </div>
                </CardHeader>
                <CardBody className="flex flex-col pt-8">
                    <label className="text-base text-gray-400">Organization Name</label>
                    <Input placeholder="Name" className="mt-2" />
                    <label className="text-base text-gray-400 mt-4">Organization Email</label>
                    <Input placeholder="Email" className="mt-2" />
                    <label className="text-base text-gray-400 mt-4">Organization Website Link</label>
                    <Input placeholder="Link" className="mt-2" />
                    <div>
                        <Button color="primary" onPress={onOpen} className="mt-4">Invite</Button>
                    </div>
                    <Table aria-label="Invited Members" className="w-full mt-4 border rounded-2xl">
                        <TableHeader>
                            <TableColumn>User</TableColumn>
                            <TableColumn>Invited</TableColumn>
                            <TableColumn>Role</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {invitedMembers.map((member, index) => (
                                <TableRow key={index}>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>{member.invited}</TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            isIconOnly
                                            color="danger"
                                            aria-label="Delete"
                                            onClick={() => handleDeleteInvitedMember(index)}
                                        >
                                            <Trash2Icon size={20} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
            <InviteModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onInvite={handleInvite}
                roles={roles}
            />
        </div>
    )
}

export default CreateOrganization;