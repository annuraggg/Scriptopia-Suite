import Loader from "@/components/Loader";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Chip,
  Divider,
  Slider,
} from "@nextui-org/react";
import { ExtendedPosting } from "@shared-types/ExtendedPosting";
import { Clock, DotIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Home = () => {
  const [postings, setPostings] = useState<ExtendedPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/postings/candidate/postings");
      if (response.data?.data) {
        setPostings(response.data.data);
        console.log("Postings:", response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch job postings:", err);
      setPostings([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (text: string) => {
    const titleCase = text.charAt(0).toUpperCase() + text.slice(1);
    return titleCase.replace(/_/g, " ");
  };

  const getAgoDays = (date: Date) => {
    const today = new Date();
    const createdAt = new Date(date);
    const diffTime = Math.abs(today.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <Loader />;

  return (
    <div className="flex p-10 gap-5">
      <div className="flex flex-col gap-5 w-[25%]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <p>Job Type</p>
            <Button variant="light" color="danger">
              Clear
            </Button>
          </CardHeader>
          <CardBody>
            <CheckboxGroup>
              <Checkbox value="full-time">Full Time</Checkbox>
              <Checkbox value="part-time">Part Time</Checkbox>
              <Checkbox value="contract">Contract</Checkbox>
              <Checkbox value="internship">Internship</Checkbox>
              <Checkbox value="temporary">Temporary</Checkbox>
            </CheckboxGroup>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <p>Salary</p>
          </CardHeader>
          <CardBody>
            <Slider
              defaultValue={[100, 500]}
              formatOptions={{ style: "currency", currency: "USD" }}
              label="Price Range"
              maxValue={1000}
              minValue={0}
              step={50}
            />
          </CardBody>
        </Card>
      </div>
      <div className="h-[88vh] w-full flex gap-5">
        {postings?.map((posting) => (
          <Card className="w-[450px] h-[230px]">
            <CardBody>
              <div className="flex gap-5 mb-3">
                <div
                  className="w-14 h-14 rounded-2xl bg-gray-200"
                  style={{
                    backgroundImage: `url(${posting?.organizationId?.logo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div>
                  <p>{posting?.title}</p>
                  <div className="flex items-center text-sm opacity-50">
                    <p>{posting?.organizationId?.name}</p>
                    <p>
                      <DotIcon />
                    </p>
                    <p>{posting?.candidates?.length} Candidates</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 my-2">
                <Chip color="success" variant="flat">
                  {normalizeText(posting?.type)}
                </Chip>

                <Chip color="warning" variant="flat">
                  {posting?.location}
                </Chip>

                <Chip color="danger" variant="flat">
                  {posting?.openings} Openings
                </Chip>
              </div>

              <div className="my-2 min-h-[20%] text-sm opacity-90 line-clamp-2 overflow-hidden text-justify">
                <p>
                  {" "}
                  {/** @ts-ignore */}
                  {posting?.description?.ops?.map((line) => (
                    <p>{line?.insert}</p>
                  ))}
                </p>
              </div>

              <Divider className="opacity-40" />

              <div className="flex justify-between items-center mt-4 text-xs opacity-70">
                {posting?.salary?.min && posting?.salary?.max && (
                  <p>
                    {posting?.salary?.currency?.toUpperCase()}{" "}
                    {posting?.salary?.min} - {posting?.salary?.max}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <p>Posted {getAgoDays(posting?.createdAt!)} days ago</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
