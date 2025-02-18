import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import ax from "@/config/axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconBone as IconMoney,
  IconUsers,
  IconAdjustments as IconDepartment,
  IconEscalator as IconSteps,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import { Posting as PostingType } from "@shared-types/Posting";
import { Organization } from "@shared-types/Organization";
import Quill from "quill";
import Loader from "@/components/Loader";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useOutletContext } from "react-router-dom";
import { Candidate } from "@shared-types/Candidate";

const routineMap = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
  contract: "Contract",
  freelance: "Freelance",
};

interface PostingOrganization extends Omit<PostingType, "organizationId"> {
  organizationId: Organization;
  createdOn: string;
}

const Posting = () => {
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState<PostingOrganization>(
    {} as PostingOrganization
  );
  const [applied, setApplied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { user } = useUser();
  const { user: userDoc } = useOutletContext() as { user: Candidate };

  useEffect(() => {
    const filter = posting?.candidates?.filter(
      (candidate: any) => candidate._id?.toString() === userDoc?._id?.toString()
    );

    if (filter && filter.length > 0) {
      setApplied(true);
    }

    console.log(userDoc);
  }, [user, posting]);

  useEffect(() => {
    setLoading(true);
    const postingId = window.location.pathname.split("/")[2];
    axios
      .get(`/postings/slug/${postingId}`)
      .then((res) => {
        setPosting(res.data.data);
        updateTimeLeft(res.data.data.applicationRange.end);
        setTimeout(() => {
          const quill = new Quill("#editor-div", {
            readOnly: true,
            theme: "bubble",
            modules: {
              toolbar: false,
            },
          });
          console.log(res.data.data.description);
          quill.setContents(res.data.data.description);
        }, 100);
      })
      .catch((err) => {
        toast.error("Failed to fetch posting details");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);

    if (isNaN(end.getTime())) {
      console.error("Invalid endDate");
      return;
    }

    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    setTimeLeft(`${days} days`);
  };

  const apply = () => {
    onOpen();
  };

  const [applyLoading, setApplyLoading] = useState(false);
  const applyToJob = () => {
    setApplyLoading(true);
    axios
      .post(`/candidates/apply`, { postingId: posting?._id })
      .then(() => {
        setApplied(true);
        toast.success("Application submitted successfully");
        onOpenChange();
      })
      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to submit application"
        );
        console.error(err);
      })
      .finally(() => setApplyLoading(false));
  };

  if (loading) {
    return <Loader />;
  }

  const isJobOpen = new Date(posting?.applicationRange?.end) > new Date();

  const getRequiredFieldsMissingCount = () => {
    let count = 0;

    if (
      posting?.additionalDetails?.basic?.summary?.required &&
      !userDoc?.summary &&
      !posting?.additionalDetails?.basic?.summary?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.links?.socialLinks?.required &&
      (userDoc?.socialLinks?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.links?.socialLinks?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.background?.education?.required &&
      (userDoc?.education?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.background?.education?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.background?.workExperience?.required &&
      (userDoc?.workExperience?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.background?.workExperience?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.skills?.technicalSkills?.required &&
      (userDoc?.technicalSkills?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.skills?.technicalSkills?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.skills?.languages?.required &&
      (userDoc?.languages?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.skills?.languages?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.skills?.subjects?.required &&
      (userDoc?.subjects?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.skills?.subjects?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.experience?.responsibilities?.required &&
      (userDoc?.responsibilities?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.experience?.responsibilities?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.experience?.projects?.required &&
      (userDoc?.projects?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.experience?.projects?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.achievements?.awards?.required &&
      (userDoc?.awards?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.achievements?.awards?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.achievements?.certificates?.required &&
      (userDoc?.certificates?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.achievements?.certificates?.allowEmpty
    ) {
      count++;
    }

    if (
      posting?.additionalDetails?.achievements?.competitions?.required &&
      (userDoc?.competitions?.length ?? 0) <= 0 &&
      !posting?.additionalDetails?.achievements?.competitions?.allowEmpty
    ) {
      count++;
    }

    return count;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <IconBuilding className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {posting?.title}
                </h1>
                <p className="text-gray-600">{posting?.organizationId?.name}</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Chip
                startContent={<IconClock size={16} />}
                color={isJobOpen ? "success" : "danger"}
                variant="flat"
              >
                {isJobOpen ? "Active" : "Closed"}
              </Chip>
              <Chip
                startContent={<IconBriefcase size={16} />}
                color="primary"
                variant="flat"
              >
                {" "}
                {/* @ts-expect-error */}
                {routineMap[posting?.type]}
              </Chip>
              <Chip
                startContent={<IconMapPin size={16} />}
                color="secondary"
                variant="flat"
              >
                {posting?.location}
              </Chip>
            </div>
          </div>
          <div className="flex gap-3">
            {applied ? (
              <Button color="success" variant="flat" disabled>
                Application Submitted
              </Button>
            ) : (
              <Button
                onClick={apply}
                color="primary"
                className="font-semibold"
                size="lg"
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Main Content - Left 2 Columns */}
        <div className="col-span-2 space-y-6">
          {/* Timeline Card */}
          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4">
              <div className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Application Timeline</h3>
              </div>
            </CardHeader>
            <CardBody className="px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-12">
                  <div>
                    <p className="text-sm text-gray-500">Posted On</p>
                    <p className="text-lg font-medium mt-1">
                      {new Date(posting?.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>
                  <IconArrowNarrowRight className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="text-lg font-medium mt-1">
                      {new Date(
                        posting?.applicationRange?.end || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Chip
                  startContent={<IconClock size={16} />}
                  variant="flat"
                  color={parseInt(timeLeft) < 7 ? "danger" : "primary"}
                >
                  {parseInt(timeLeft) < 0 ? "Closed" : `${timeLeft} remaining`}
                </Chip>
              </div>
            </CardBody>
          </Card>

          {/* Job Description */}
          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4">
              <div className="flex items-center gap-2">
                <IconBriefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Job Description</h3>
              </div>
            </CardHeader>
            <CardBody className="px-6">
              <div id="editor-div" className="prose max-w-none" />
            </CardBody>
          </Card>

          {/* Application Process */}
          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4">
              <div className="flex items-center gap-2">
                <IconSteps className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Application Process</h3>
              </div>
            </CardHeader>
            <CardBody className="px-6">
              <div>
                {posting?.workflow?.steps?.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full text-sm flex items-center justify-center  font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h6>{step.name}</h6>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Job Details */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4">
              <h3 className="text-lg font-semibold">Job Overview</h3>
            </CardHeader>
            <CardBody className="px-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <IconMoney className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="font-medium mt-1">
                      {posting?.salary?.min?.toLocaleString()} -{" "}
                      {posting?.salary?.max?.toLocaleString()}{" "}
                      {posting?.salary?.currency?.toUpperCase()}
                    </p>
                  </div>
                </div>

                <Divider />

                <div className="flex items-start gap-3">
                  <IconUsers className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Number of Openings</p>
                    <p className="font-medium mt-1">
                      {posting?.openings} positions
                    </p>
                  </div>
                </div>

                <Divider />

                <div className="flex items-start gap-3">
                  <IconDepartment className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium mt-1">
                      {
                        posting?.organizationId?.departments?.find(
                          (d) => d._id === posting?.department
                        )?.name
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4">
              <h3 className="text-lg font-semibold">About the Company</h3>
            </CardHeader>
            <CardBody className="px-6">
              <div>
                <img
                  src={
                    posting?.organizationId?.logo || "/api/placeholder/200/100"
                  }
                  alt="Company logo"
                  className=" rounded-2xl h-20"
                />
                <h4 className="font-medium text-lg">
                  {posting?.organizationId?.name}
                </h4>
                <a
                  className="text-gray-600 text-sm hover:underline hover:text-primary cursor-pointer"
                  href={`mailto:${posting?.organizationId?.email}`}
                >
                  {posting?.organizationId?.email}
                </a>
                <br />
                <a
                  className="text-gray-600 text-sm hover:underline hover:text-primary cursor-pointer"
                  href={`${posting?.organizationId?.website}`}
                >
                  {posting?.organizationId?.website}
                </a>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Apply</ModalHeader>
              <ModalBody>
                <p>
                  Please note that the following details of your profile are
                  required.
                </p>

                {posting?.additionalDetails?.basic?.summary?.required && (
                  <div className="flex items-center gap-2">
                    <p>Summary</p>
                    {!userDoc?.summary && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.basic?.summary
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.links?.socialLinks?.required && (
                  <div className="flex items-center gap-2">
                    <p>Social Links</p>
                    {(userDoc?.socialLinks?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.links?.socialLinks
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.background?.education
                  ?.required && (
                  <div className="flex items-center gap-2">
                    <p>Education</p>
                    {(userDoc?.education?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.background?.education
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.background?.workExperience
                  ?.required && (
                  <div className="flex items-center gap-2">
                    <p>Work Experience</p>
                    {(userDoc?.workExperience?.length ?? 0) <= 0 && (
                      <>
                        {" "}
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.background?.workExperience
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.skills?.technicalSkills
                  ?.required && (
                  <div className="flex items-center gap-2">
                    <p>Technical Skills</p>
                    {(userDoc?.technicalSkills?.length ?? 0) <= 0 && (
                      <>
                        {" "}
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.skills?.technicalSkills
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.skills?.languages?.required && (
                  <div className="flex items-center gap-2">
                    <p>Languages</p>
                    {(userDoc?.languages?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                          {posting?.additionalDetails?.skills?.languages
                            ?.allowEmpty && (
                            <Chip color="warning" variant="flat">
                              Optional
                            </Chip>
                          )}
                        </Chip>
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.skills?.subjects?.required && (
                  <div className="flex items-center gap-2">
                    <p>Subjects</p>
                    {(userDoc?.subjects?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.skills?.subjects
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.experience?.responsibilities
                  ?.required && (
                  <div className="flex items-center gap-2">
                    <p>Responsibilities</p>
                    {(userDoc?.responsibilities?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.experience
                          ?.responsibilities?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.experience?.projects?.required && (
                  <div className="flex items-center gap-2">
                    <p>Projects</p>
                    {(userDoc?.projects?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.experience?.projects
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.achievements?.awards?.required && (
                  <div className="flex items-center gap-2">
                    <p>Awards</p>
                    {(userDoc?.awards?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.achievements?.awards
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.achievements?.certificates
                  ?.required && (
                  <div className="flex items-center gap-2">
                    {" "}
                    <p>Certificates</p>
                    {(userDoc?.certificates?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.achievements?.certificates
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                {posting?.additionalDetails?.achievements?.competitions
                  ?.required && (
                  <div className="flex items-center gap-2">
                    <p>Competitions</p>
                    {(userDoc?.competitions?.length ?? 0) <= 0 && (
                      <>
                        <Chip color="danger" variant="flat">
                          Missing
                        </Chip>
                        {posting?.additionalDetails?.achievements?.competitions
                          ?.allowEmpty && (
                          <Chip color="warning" variant="flat">
                            Optional
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                )}

                <p>
                  Please make sure these fields are updated in your{" "}
                  <a
                    href="/profile"
                    target="_blank"
                    className="underline hover:text-blue-500"
                  >
                    profile
                  </a>
                  .
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={applyToJob}
                  isDisabled={getRequiredFieldsMissingCount() > 0}
                  isLoading={applyLoading}
                >
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Posting;
