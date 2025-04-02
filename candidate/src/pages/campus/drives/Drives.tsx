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
  Input,
  Slider,
} from "@nextui-org/react";
import { ExtendedPosting } from "@shared-types/ExtendedPosting";
import { Clock, DotIcon, Search } from "lucide-react";
import { Delta } from "quill";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [postings, setPostings] = useState<ExtendedPosting[]>([]);
  const [filteredPostings, setFilteredPostings] = useState<ExtendedPosting[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([0, 1000000]);
  const [searchQuery, setSearchQuery] = useState("");

  const { getToken } = useAuth();
  const navigate = useNavigate();
  const axios = ax(getToken);

  useEffect(() => {
    fetchPostings();
  }, []);

  // Apply filters whenever the filter values or postings change
  useEffect(() => {
    applyFilters();
  }, [selectedJobTypes, salaryRange, postings, searchQuery]);

  const fetchPostings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/drives/candidate");
      if (response.data?.data) {
        setPostings(response.data.data.drives);
        setFilteredPostings(response.data.data.drives);
      }
    } catch (err) {
      console.error("Failed to fetch job postings:", err);
      setPostings([]);
      setFilteredPostings([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...postings];

    // Apply job type filter
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((posting) =>
        selectedJobTypes.includes(posting.type.toLowerCase())
      );
    }

    // Apply salary filter
    filtered = filtered.filter((posting) => {
      const minSalary = posting.salary?.min || 0;
      const maxSalary = posting.salary?.max || 0;

      // Check if the salary range overlaps with the filter range
      return (
        (minSalary >= salaryRange[0] && minSalary <= salaryRange[1]) ||
        (maxSalary >= salaryRange[0] && maxSalary <= salaryRange[1]) ||
        (minSalary <= salaryRange[0] && maxSalary >= salaryRange[1])
      );
    });

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter((posting) =>
        posting.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPostings(filtered);
  };

  const handleJobTypeChange = (values: string[]) => {
    setSelectedJobTypes(values);
  };

  const handleSalaryChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setSalaryRange(value);
    }
  };

  const clearFilters = () => {
    setSelectedJobTypes([]);
    setSalaryRange([0, 1000]);
    setFilteredPostings(postings);
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
          <Input
            placeholder="Search"
            startContent={<Search size={16} />}
            className="w-full"
            variant="bordered"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <p>Job Type</p>
            <Button variant="light" color="danger" onClick={clearFilters}>
              Clear
            </Button>
          </CardHeader>
          <CardBody>
            <CheckboxGroup
              value={selectedJobTypes}
              onChange={handleJobTypeChange}
            >
              <Checkbox value="full_time">Full Time</Checkbox>
              <Checkbox value="part_time">Part Time</Checkbox>
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
              value={salaryRange}
              onChange={handleSalaryChange}
              formatOptions={{ style: "currency", currency: "USD" }}
              label=" "
              maxValue={1000000}
              minValue={0}
              step={50}
              className="max-w-md"
            />
          </CardBody>
        </Card>
      </div>
      <div className="h-[88vh] w-full flex flex-wrap gap-5">
        {filteredPostings.map((posting) => (
          <Card
            key={posting._id}
            className="w-[450px] h-[230px]"
            isPressable
            onPress={() => navigate(`${posting._id}`)}
          >
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
                  {(posting?.description?.ops as Delta)?.map((line, index) => (
                    <span key={index}>{line?.insert?.toString()}</span>
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
