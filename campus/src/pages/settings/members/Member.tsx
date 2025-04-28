import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import InviteModal from "./InviteModal";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Member } from "@shared-types/Institute";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useOutletContext } from "react-router-dom";
import { SettingsContext } from "@/types/SettingsContext";

const Members: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [members, setMembers] = useState<Member[]>([]);
  const [invitedMembers, setInvitedMembers] = useState<Member[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>("");

  const {
    isOpen: removeConfirmOpen,
    onOpen: onRemoveConfirmOpen,
    onOpenChange: onRemoveConfirmOpenChange,
  } = useDisclosure();
  const {
    isOpen: revokeConfirmOpen,
    onOpen: onRevokeConfirmOpen,
    onOpenChange: onRevokeConfirmOpenChange,
  } = useDisclosure();

  const { institute, setInstitute, user, rerender } =
    useOutletContext() as SettingsContext;

  const [innerRerender, setInnerRerender] = useState(false);

  useEffect(() => {
    if (!institute.members) return;
    console.log(institute.members);

    const finalMembers = institute.members.filter(
      (member: Member) => member.status === "active"
    );

    const finalInvitedMembers = institute.members.filter(
      (member: Member) => member.status === "pending"
    );

    setMembers(finalMembers);
    setInvitedMembers(finalInvitedMembers);
  }, [rerender, innerRerender]);

  const handleInvite = (newMember: Member) => {
    const newInstitute = { ...institute };
    newInstitute.members = [...(newInstitute.members || []), newMember];
    setInstitute(newInstitute);
    setInvitedMembers([...invitedMembers, newMember]);
  };

  const handleRoleChange = (index: number, newRole: string) => {
    if (!newRole) return;
    const newInstitute = { ...institute };
    const updatedMembers = [...(newInstitute.members || [])];
    updatedMembers[index].role = newRole;
    setInstitute({ ...newInstitute, members: updatedMembers });
  };

  const removeMember = (email: string) => {
    onRemoveConfirmOpenChange();
    const newInstitute = { ...institute };
    const updatedMembers = newInstitute.members?.filter(
      (member) => member.email !== email
    );
    setInstitute({ ...newInstitute, members: updatedMembers });
    setInnerRerender(!innerRerender);
  };

  const revokeMember = (email: string) => {
    const newInstitute = { ...institute };
    const updatedMembers = newInstitute.members?.filter(
      (member) => member.email !== email
    );
    setInstitute({ ...newInstitute, members: updatedMembers });

    onRevokeConfirmOpenChange();
  };

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{institute?.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/members"}>Members</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex flex-col items-start justify-start w-full h-full p-5">
        <Tabs aria-label="Options" className="w-full pt-7" variant="underlined">
          <Tab key="members" title="Members" className="w-full">
            <Table aria-label="Members" className="w-full">
              <TableHeader>
                <TableColumn>User</TableColumn>
                <TableColumn>Joined</TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody emptyContent={<p>No Members</p>}>
                {members?.map((member, index) => (
                  <TableRow key={member.email}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {member?.createdAt
                        ? new Date(member.createdAt).toLocaleDateString()
                        : "pending"}
                    </TableCell>

                    <TableCell className="w-[200px]">
                      <Select
                        className="w-[200px]"
                        defaultSelectedKeys={[member.role]}
                        aria-label="Role"
                        onSelectionChange={(keys) => {
                          handleRoleChange(index, keys.currentKey as string);
                        }}
                        isDisabled={member._id === user._id}
                      >
                        {(institute?.roles || []).map((role) => (
                          <SelectItem key={role?.slug!}>{role.name}</SelectItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      {member._id !== user._id && (
                        <p
                          className=" text-danger hover:text-danger-500 duration-300 transition-colors cursor-pointer py-3"
                          onClick={() => {
                            setSelectedEmail(member.email);
                            onRemoveConfirmOpen();
                          }}
                        >
                          Remove
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>
          <Tab key="invite" title="Invites" className="w-full">
            <Button color="default" onPress={onOpen}>
              Invite
            </Button>
            <Table aria-label="Invited Members" className="w-full mt-4">
              <TableHeader>
                <TableColumn>User</TableColumn>
                <TableColumn>Invited</TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody emptyContent={<p>No Invited Members</p>}>
                {invitedMembers?.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {member?.createdAt
                        ? new Date(member.createdAt).toLocaleDateString()
                        : "pending"}
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <p
                        className=" text-danger hover:text-danger-500 duration-300 transition-colors cursor-pointer py-3"
                        onClick={() => {
                          setSelectedEmail(member.email);
                          onRevokeConfirmOpen();
                        }}
                      >
                        Revoke
                      </p>
                    </TableCell>
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
          roles={institute?.roles || []}
        />
      </div>

      <Modal
        isOpen={removeConfirmOpen}
        onOpenChange={onRemoveConfirmOpenChange}
        className="w-[400px]"
      >
        <ModalContent>
          <ModalHeader>Remove Member</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to remove this member?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              onPress={onRemoveConfirmOpenChange}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button color="danger" onClick={() => removeMember(selectedEmail)}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={revokeConfirmOpen}
        onOpenChange={onRevokeConfirmOpenChange}
        className="w-[400px]"
      >
        <ModalContent>
          <ModalHeader>Revoke Invite</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to revoke this invite?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              onPress={onRevokeConfirmOpenChange}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button color="danger" onClick={() => revokeMember(selectedEmail)}>
              Revoke
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Members;
