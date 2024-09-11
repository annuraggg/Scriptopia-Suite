import ax from "@/config/axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Button, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { AppliedPosting } from "@shared-types/Candidate";
import { Organization } from "@shared-types/Organization";
import { Posting as PostingType } from "@shared-types/Posting";
import {
  Briefcase,
  CircleDollarSign,
  Link,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";

const Posting = () => {
  const { posting, organization } = useOutletContext() as {
    posting: PostingType;
    organization: Organization;
  };

  const routineMap = {
    full_time: "Full Time",
    part_time: "Part Time",
    internship: "Internship",
  };

  const navigate = useNavigate();
  const apply = () => {
    navigate("/postings/" + posting.url + "/apply");
  };

  const [applied, setApplied] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  const axios = ax(getToken);
  useEffect(() => {
    axios
      .get(`/candidates/${user?.id}`)
      .then((res) => {
        const posted = res.data.data.posted;
        if (posted.some((p: AppliedPosting) => p.postingId === posting._id)) {
          setApplied(true);
        }
      })
      .catch((err) => {
        toast.error("Failed to fetch candidate details");
        console.log(err.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-10 flex gap-5">
      <div className="w-full">
        <Card>
          <CardHeader className="opacity-50">Company Info</CardHeader>
          <CardBody>
            <h4>{organization?.name}</h4>

            <div className="flex gap-2 items-center mt-5 text-sm opacity-70">
              <Link size={16} />
              <p
                className="hover:underline cursor-pointer"
                onClick={() => {
                  window.open(organization?.website, "_blank");
                }}
              >
                Website: {organization?.website}
              </p>
            </div>

            <div className="flex gap-2 items-center mt-2 text-sm opacity-70">
              <Mail size={16} />
              <p
                className="hover:underline cursor-pointer"
                onClick={() => {
                  window.open("mailto:" + organization?.email);
                }}
              >
                Email: {organization?.email}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="mt-5">
          <CardHeader className="opacity-50">Job Info</CardHeader>
          <CardBody>
            <p className="text-green-500 text-xs">
              Open Until{" "}
              {new Date(posting?.applicationRange?.end)?.toLocaleString()}
            </p>

            <div className="flex gap-2 items-center mt-5 text-sm opacity-70">
              <User size={16} />
              <p>Job Title: {posting?.title}</p>
            </div>
            <div className="flex gap-2 items-center mt-1 text-sm opacity-70">
              <Briefcase size={16} />
              <p>Routine: {routineMap[posting?.type]}</p>
            </div>
            <div className="flex gap-2 items-center text-sm mt-1 opacity-70">
              <MapPin size={16} />
              <p>Location: {posting?.location}</p>
            </div>
            <div className="flex gap-2 items-center text-sm mt-1 opacity-70">
              <CircleDollarSign size={16} />
              <p>
                Pay: {posting?.salary?.min} - {posting?.salary?.max}{" "}
                {posting?.salary?.currency?.toUpperCase()}
              </p>
            </div>

            <div className="my-5" />
            <div>
              <p>Qualifications / Responsibilites</p>
              <pre className=" opacity-50 mt-2 whitespace-pre-wrap">
                {posting?.qualifications}
              </pre>
            </div>

            <div className="my-5" />
            <div>
              <p className="mb-2">Skills</p>
              {posting?.skills?.map((skill, i) => (
                <Chip key={i} className="mr-2">
                  {skill}
                </Chip>
              ))}
            </div>
            <div className="my-2" />
          </CardBody>
        </Card>
      </div>

      <div className="w-full">
        <Card className="h-[90%] overflow-auto">
          <CardHeader className="opacity-50">About</CardHeader>
          <CardBody className="opacity-70">
            <pre className="whitespace-pre-wrap">{posting?.description}</pre>
          </CardBody>
        </Card>
        {applied ? (
          <p className="mt-5 float-right text-success-500">Already Applied</p>
        ) : (
          <Button
            className="mt-5 float-right"
            color="success"
            variant="flat"
            onClick={apply}
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );
};

export default Posting;
