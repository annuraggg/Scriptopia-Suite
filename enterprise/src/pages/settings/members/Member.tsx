import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Tab,
  Tabs,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import InviteModal from "./InviteModal";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useAuth, useUser } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Member } from "@shared-types/Organization";
import { Role } from "@shared-types/Organization";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { setToastChanges } from "@/reducers/toastReducer";
import UnsavedToast from "@/components/UnsavedToast";

const Members: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [members, setMembers] = useState<Member[]>([]);
  const [invitedMembers, setInvitedMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [changes, setChanges] = useState<boolean>(false);
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [userEmails, setUserEmails] = useState<string[]>([]);

  const dispatch = useDispatch();

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

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (user && isLoaded) {
      setUserEmails(user.emailAddresses.map((email) => email.emailAddress));
    }
  }, [isLoaded, user]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("organizations/settings")
      .then((res) => {
        setMembers(
          res.data.data.members.filter(
            (member: Member) => member.status === "active"
          )
        );

        setInvitedMembers(
          res.data.data.members.filter(
            (member: Member) => member.status === "pending"
          )
        );

        setRoles(res.data.data.roles);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error Fetching Settings");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveChanges = () => {
    const next = () => {
      setLoading(true);
      axios
        .post("organizations/settings/members", {
          screen: "members",
          members: members.concat(invitedMembers),
        })
        .then(() => {
          setChanges(false);
          toast.success("Changes Saved");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error Saving Changes");
        })
        .finally(() => {
          dispatch(setToastChanges(false));
          setLoading(false);
        });
    };

    next();
  };

  const triggerSaveToast = () => {
    if (!changes) {
      dispatch(setToastChanges(true));
    }
  };

  const handleInvite = (newMember: Member) => {
    setInvitedMembers([...invitedMembers, newMember]);
    triggerSaveToast();
  };

  const handleRoleChange = (index: number, newRole: Role | string) => {
    if (!newRole) return;
    const updatedMembers = [...members];
    updatedMembers[index].role = roles.find(
      (role) => role.name === newRole
    ) as Role;
    setMembers(updatedMembers);
    triggerSaveToast();
  };

  const removeMember = (email: string) => {
    const updatedMembers = members.filter((member) => member.email !== email);
    setMembers(updatedMembers);
    triggerSaveToast();
    onRemoveConfirmOpenChange();
  };

  const revokeMember = (email: string) => {
    const updatedInvitedMembers = invitedMembers.filter(
      (member) => member.email !== email
    );

    setInvitedMembers(updatedInvitedMembers);
    triggerSaveToast();
    onRevokeConfirmOpenChange();
  };

  if (loading || !isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <UnsavedToast action={saveChanges} />
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/members"}>Members</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex flex-col items-start justify-start w-full h-full p-5">
        <h1 className="text-3xl">Members</h1>
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
                {members.map((member, index) => (
                  <TableRow key={member.email}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {member?.addedOn
                        ? new Date(member.addedOn).toLocaleDateString()
                        : "pending"}
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <Select
                        className="w-[200px]"
                        selectedKeys={typeof member.role !== "string" ? [member.role.name] : []}
                        aria-label="Role"
                        isDisabled={
                          userEmails.filter((email) => email === member.email)
                            .length !== 0
                        }
                        onSelectionChange={(keys) =>
                          handleRoleChange(
                            index,
                            typeof member.role === "string"
                              ? member.role
                              : (Array.from(keys)[0] as string)
                          )
                        }
                      >
                        {roles.map((role) => (
                          <SelectItem key={role.name} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      {!userEmails.find((email) => email === member.email) && (
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
                {invitedMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {member?.addedOn
                        ? new Date(member.addedOn).toLocaleDateString()
                        : "pending"}
                    </TableCell>
                    <TableCell>
                      {typeof member.role === "string"
                        ? member.role
                        : member.role.name}
                    </TableCell>
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
          roles={roles}
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
