import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ax from "@/config/axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Link,
  Tooltip,
  ScrollShadow,
  Progress,
} from "@nextui-org/react";
import {
  Briefcase,
  DollarSign,
  Globe,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  Clock,
  FileText,
  GraduationCap,
  Tags,
  Building2,
  Users,
  Calendar,
  Award,
  Workflow,
  BookOpen,
  Timer,
} from "lucide-react";
import { Posting as PostingType } from "@shared-types/Posting";
import { Organization } from "@shared-types/Organization";

const routineMap = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
};

interface PostingOrganization extends Omit<PostingType, "organizationId"> {
  organizationId: Organization;
}

const Posting = () => {
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const axios = ax(getToken);
  const [posting, setPosting] = useState<PostingOrganization>(
    {} as PostingOrganization
  );
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const postingId = window.location.pathname.split("/")[2];
    axios
      .get(`/postings/slug/${postingId}`)
      .then((res) => {
        setPosting(res.data.data);
        updateTimeLeft(res.data.data.applicationRange.end);
      })
      .catch((err) => {
        toast.error("Failed to fetch posting details");
        console.error(err);
      });
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
    navigate("/postings/" + posting?.url + "/apply");
  };

  return (
    <div className="p-5">
      <div className="mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {posting?.organizationId?.logo ? (
                  <img
                    src={posting.organizationId.logo}
                    alt="Company Logo"
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <Building2 size={40} className="text-gray-400" />
                )}
              </div>

              {/* Middle - Job Info */}
              <div className="flex-grow">
                <h1 className="text-2xl font-bold mb-2">{posting?.title}</h1>
                <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Organization: {posting?.organizationId?.name}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <Chip
                    startContent={<Briefcase size={16} />}
                    variant="flat"
                    size="sm"
                  >
                    {routineMap[posting?.type]}
                  </Chip>
                  <Chip
                    startContent={<MapPin size={16} />}
                    variant="flat"
                    size="sm"
                  >
                    {posting?.location}
                  </Chip>
                  <Chip
                    startContent={<DollarSign size={16} />}
                    variant="flat"
                    color="success"
                    size="sm"
                  >
                    {posting?.salary?.min?.toLocaleString()} -{" "}
                    {posting?.salary?.max?.toLocaleString()}{" "}
                    {posting?.salary?.currency?.toUpperCase()}
                  </Chip>
                  <Chip
                    startContent={<Users size={16} />}
                    variant="flat"
                    size="sm"
                  >
                    {posting?.openings}{" "}
                    {posting?.openings > 1 ? "Positions" : "Position"}
                  </Chip>
                  {posting?.department && (
                    <Chip
                      startContent={<p>Department: </p>}
                      variant="flat"
                      size="sm"
                    >
                      {
                        posting?.organizationId?.departments?.find(
                          (d) => d._id === posting?.department
                        )?.name
                      }
                    </Chip>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="flex gap-3">
                  <Tooltip content="Visit Website">
                    <Link
                      href={posting?.organizationId?.website}
                      target="_blank"
                      color="primary"
                    >
                      <Globe size={24} />
                    </Link>
                  </Tooltip>
                  <Tooltip content="Send Email">
                    <Link
                      href={`mailto:${posting?.organizationId?.email}`}
                      color="primary"
                    >
                      <Mail size={24} />
                    </Link>
                  </Tooltip>
                </div>

                <Card>
                  <CardBody className="py-2 px-4">
                    <div className="text-center">
                      <p className="text-sm">Application Deadline</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={16} className="text-primary" />
                        <span className="font-semibold">{timeLeft} left</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {applied ? (
                  <Chip
                    color="success"
                    variant="flat"
                    size="lg"
                    startContent={<CheckCircle size={20} />}
                  >
                    Application Submitted
                  </Chip>
                ) : (
                  <Button
                    variant="flat"
                    endContent={<ArrowRight size={20} />}
                    onClick={apply}
                    color="success"
                    className="w-full"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-md">
              <CardHeader className="flex gap-3">
                <FileText className="text-primary" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Job Description</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    What you'll be doing
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <ScrollShadow className="h-[300px]">
                  <pre className="whitespace-pre-wrap text-foreground-700">
                    {posting?.description}
                  </pre>
                </ScrollShadow>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="flex gap-3">
                <GraduationCap className="text-primary" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Qualifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    What we're looking for
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <ScrollShadow className="h-[250px]">
                  <pre className="whitespace-pre-wrap text-foreground-700">
                    {posting?.qualifications}
                  </pre>
                </ScrollShadow>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader className="flex gap-3">
                <Tags className="text-primary" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Required Skills</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Technical expertise
                  </p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {posting?.skills?.map((skill, i) => (
                    <Chip key={i} variant="flat" size="sm">
                      {skill}
                    </Chip>
                  ))}
                </div>
              </CardBody>
            </Card>

            {posting?.workflow && (
              <Card className="shadow-md">
                <CardHeader className="flex gap-3">
                  <Workflow className="text-primary" />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">Selection Process</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Application workflow
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {posting.workflow.steps?.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{step.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posting;
