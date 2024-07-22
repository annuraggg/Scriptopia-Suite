import {
  Briefcase,
  Building2Icon,
  FileText,
  Filter,
  Inbox,
  LinkIcon,
  MailIcon,
  MessageCircle,
  Shield,
  Trash2Icon,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableColumn,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InvitedMember {
  email: string;
  invited: string;
  role: string;
}

interface Role {
  role: string;
}

const Lander = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [api, setApi] = useState<CarouselApi>();
  const [updateFlag, setUpdateFlag] = useState(false);

  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);
  const [email, setEmail] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const roles: Role[] = [
    { role: "Admin" },
    { role: "Hiring Manager" },
    { role: "Finance" },
    { role: "Read Only" },
  ];

  useEffect(() => {
    if (!isOpen) {
      if (window.location.hash === "#create") return onOpen();
    }
  }, [isOpen, onOpen, onOpenChange]);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange();
    if (!isOpen) {
      window.location.hash = "";
    } else {
      window.location.hash = "create";
    }
  };

  const handleInvite = () => {
    if (email && selectedRole) {
      const currentDate = new Date().toLocaleDateString("en-GB");
      setInvitedMembers([
        ...invitedMembers,
        { email, role: selectedRole, invited: currentDate },
      ]);
      setEmail("");
      setSelectedRole("");
    }
  };

  const handleDeleteInvitedMember = (index: number) => {
    const updatedMembers = invitedMembers.filter((_, i) => i !== index);
    setInvitedMembers(updatedMembers);
  };

  const submit = () => {
    setSubmitting(true);
    toast.promise(
      new Promise((resolve) =>
        setTimeout(() => {
          onClose();
          window.location.hash = "";
          resolve("");
        }, 2000)
      ),
      {
        loading: "Creating Organization",
        success: "Organization Created Successfully",
        error: "Failed to Create Organization",
      }
    );
  };

  const steps = [
    {
      title: "Job Posting and Requisition Management",
      desc: "Effortlessly create and distribute job postings to multiple platforms.\n Track and manage job requisitions with ease.",
    },
    {
      title: "Application Collection",
      desc: "Collect applications from job boards, company websites, and direct submissions. \n Parse and store applicant information, resumes, and cover letters securely.",
    },
    {
      title: "Automated Resume Screening",
      desc: "Display a curated list of selected candidates for your review. \n Easily manage and track candidate progress.",
    },
    {
      title: "Assessments",
      desc: "Create tailored assessments including multiple-choice questions and coding challenges.\n Evaluate candidates' skills directly on our platform.",
    },
    {
      title: "Conduct interviews.",
      desc: "Schedule interviews, communicate with candidates, and gather feedback seamlessly.",
    },
  ];

  const features = [
    {
      name: "Job Posting and Requisition Management",
      icon: <Briefcase size={30} className="text-gray-500" />,
    },
    {
      name: "Application Collection",
      icon: <Inbox size={30} className="text-gray-500" />,
    },
    {
      name: "Automated Resume Screening",
      icon: <Filter size={30} className="text-gray-500" />,
    },
    {
      name: "Candidate Shortlisting",
      icon: <UserCheck size={30} className="text-gray-500" />,
    },
    {
      name: "Assessments",
      icon: <FileText size={30} className="text-gray-500" />,
    },
    {
      name: "Candidate Management",
      icon: <Users size={30} className="text-gray-500" />,
    },
    {
      name: "Enhanced Communication",
      icon: <MessageCircle size={30} className="text-gray-500" />,
    },
    {
      name: "Advanced Security and Privacy",
      icon: <Shield size={30} className="text-gray-500" />,
    },
  ];

  const prices = [
    { name: "Quaterly", price: 24.99, monthly: 8.33 },
    {
      name: "Annual",
      price: 59.99,
      monthly: 4.99,
      desc: "Save 40% with an annual subscription",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center m-20"
      >
        <div className="text-center mt-10">
          <h1 className="text-7xl font-poly drop-shadow-glow">
            Scriptopia Organizations
          </h1>
          <p className="mt-5 font-poly text-gray-300">
            Industry Grade Screening and Hiring ATS
          </p>
          <Button
            className="mt-10"
            variant="flat"
            color="success"
            onClick={() => {
              // add hash to url
              window.location.hash = "create";
              onOpen();
            }}
          >
            Get Started
          </Button>
        </div>

        <div className="mt-5 font-poly">
          {steps.map((step, index) => (
            <div className=" p-5 rounded-lg flex justify-between mt-2 w-[60vw] ">
              <div className=" w-full">
                <p className="text-gray-500 text-xs">Step {index + 1}</p>
                <h5 className="text-gray-300 text-2xl">{step.title}</h5>
              </div>
              <p className="w-[50%] text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 font-poly text-center">
          <h5>The Swiss Army Knife of Screening and Hiring</h5>
          <div className="flex flex-wrap justify-between mt-5">
            {features.map((feature) => (
              <div className="flex items-center gap-5 mt-5 border w-[49%] p-10 rounded-xl bg-gray-500 bg-opacity-5">
                {feature.icon}
                <p>{feature.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className=" mt-10 w-full">
          <h5 className="text-center">Pricing</h5>
          <p className="text-gray-500 text-xs text-center">
            Available as a Quaterly or Annual Subscription
          </p>
          <div className="flex justify-between mt-5 gap-5 w-full">
            {prices.map((price) => (
              <div className="border p-5 rounded-lg w-full bg-gray-500 bg-opacity-5 relative pb-20">
                <h5>{price.name}</h5>
                <h1 className="text-gray-300 mt-5 font-poly">
                  ${price.monthly} <sub>/month</sub>
                </h1>

                <p className="text-gray-500 text-xs mt-5">
                  Billed ${price.price} {price.name}
                </p>

                {price.desc && (
                  <p className="text-xs text-warning mt-2">{price.desc}</p>
                )}
                <Button
                  className="mt-5 float-right absolute right-5 bottom-5"
                  variant="flat"
                  color="success"
                >
                  Subscribe
                </Button>
              </div>
            ))}
          </div>

          <div className="h-20"></div>
        </div>
      </motion.div>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        size="4xl"
        className="min-h-[60vh]"
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex gap-3 items-center">
                <Building2Icon size={30} />
                <p>Create Organization</p>
              </ModalHeader>
              <ModalBody>
                <Carousel setApi={setApi}>
                  <CarouselContent>
                    <CarouselItem>
                      <Input
                        label="Organization Name"
                        className="pt-7"
                        placeholder="Name"
                        labelPlacement="outside"
                        startContent={
                          <Building2Icon
                            size={20}
                            className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                          />
                        }
                      />
                      <Input
                        label="Organization Email"
                        className="pt-7"
                        labelPlacement="outside"
                        placeholder="Email"
                        startContent={
                          <MailIcon
                            size={20}
                            className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                          />
                        }
                      />
                      <Input
                        label="Organization Website Link"
                        className="pt-7"
                        labelPlacement="outside"
                        placeholder="Link"
                        startContent={
                          <LinkIcon
                            size={20}
                            className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                          />
                        }
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <div>
                        <div className="flex gap-3 mb-3 items-center">
                          <Input
                            label="Email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="sm"
                          />
                          <Select
                            label="Role"
                            placeholder="Select a role"
                            size="sm"
                            selectedKeys={selectedRole ? [selectedRole] : []}
                            onSelectionChange={(keys) =>
                              setSelectedRole(Array.from(keys)[0] as string)
                            }
                          >
                            {roles.map((role) => (
                              <SelectItem key={role.role} value={role.role}>
                                {role.role}
                              </SelectItem>
                            ))}
                          </Select>
                          <Button onPress={handleInvite}>Invite</Button>
                        </div>
                        <Table aria-label="Invited Members" removeWrapper>
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
                                    variant="flat"
                                    aria-label="Delete"
                                    onClick={() =>
                                      handleDeleteInvitedMember(index)
                                    }
                                  >
                                    <Trash2Icon size={16} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                </Carousel>
              </ModalBody>
              <ModalFooter>
                {api?.canScrollPrev() && (
                  <Button
                    isDisabled={submitting}
                    onPress={() => {
                      api?.scrollPrev();
                      setUpdateFlag(!updateFlag);
                    }}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  isDisabled={submitting}
                  color={!api?.canScrollNext() ? "success" : "default"}
                  variant="flat"
                  onPress={() => {
                    if (api?.canScrollNext()) {
                      api?.scrollNext();
                      setUpdateFlag(!updateFlag);
                    } else {
                      submit();
                    }
                  }}
                >
                  {!api?.canScrollNext() ? "Finish" : "Next"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Lander;
