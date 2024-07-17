import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Tab,
  Tabs,
  Button,
  Select,
  SelectItem,
  useDisclosure,
  SelectSection
} from "@nextui-org/react";
import InviteModal from "./InviteModal";

interface Member {
  name: string;
  joined: string;
  role: string;
}

interface InvitedMember {
  email: string;
  invited: string;
  role: string;
}

interface Role {
  role: string;
}

const Members: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [members, setMembers] = useState<Member[]>([
    { name: "John Doe", joined: "15/07/2024", role: "Admin" },
    { name: "Jane Doe", joined: "15/07/2024", role: "Hiring Manager" },
    { name: "Anurag Sawant", joined: "14/7/2024", role: "Finance" },
  ]);

  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);

  const roles: Role[] = [
    { role: "Admin" },
    { role: "Hiring Manager" },
    { role: "Finance" },
    { role: "Read Only" },
  ];

  const handleInvite = (newMember: InvitedMember) => {
    setInvitedMembers([...invitedMembers, newMember]);
  };

  const handleRoleChange = (index: number, newRole: string) => {
    const updatedMembers = [...members];
    updatedMembers[index].role = newRole;
    setMembers(updatedMembers);
  };

  return (
    <div className="flex flex-col items-start justify-start w-full h-full">
      <h1 className="text-3xl">Members</h1>
      <Tabs aria-label="Options" className='w-full pt-7' variant="underlined">
        <Tab key="members" title="Members" className="w-full">
          <Table aria-label="Members" className="w-[60%]">
            <TableHeader>
              <TableColumn>User</TableColumn>
              <TableColumn>Joined</TableColumn>
              <TableColumn>Role</TableColumn>
            </TableHeader>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={member.name}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.joined}</TableCell>
                  <TableCell>
                    <Select
                      selectedKeys={[member.role]}
                      onSelectionChange={(keys) => handleRoleChange(index, Array.from(keys)[0] as string)}
                    >
                      {roles.map((role) => (
                        <SelectSection className="">
                          <SelectItem key={role.role} value={role.role} className="">
                            {role.role}
                          </SelectItem>
                        </SelectSection>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tab>
        <Tab key="invite" title="Invite" className="w-full">
          <Button color="primary" onPress={onOpen}>Invite</Button>
          <Table aria-label="Invited Members" className="w-[60%] mt-4">
            <TableHeader>
              <TableColumn>User</TableColumn>
              <TableColumn>Invited</TableColumn>
              <TableColumn>Role</TableColumn>
            </TableHeader>
            <TableBody>
              {invitedMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.invited}</TableCell>
                  <TableCell>{member.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tab>
      </Tabs>
      <InviteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onInvite={handleInvite}
        roles={roles}
      />
    </div>
  );
};

export default Members;