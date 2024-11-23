import {
  Button,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  DateValue,
  RangeValue,
} from "@nextui-org/react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { RootContext } from "@/types/RootContext";

interface JobDetailsProps {
  setAction: Dispatch<SetStateAction<number>>;
  title: string;
  setTitle: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  openings: number;
  setOpenings: (value: number) => void;
  applicationRange: RangeValue<DateValue>;
  setApplicationRange: (value: RangeValue<DateValue>) => void;
  currency: string;
  setCurrency: (value: string) => void;
  minSalary: number;
  setMinSalary: (value: number) => void;
  maxSalary: number;
  setMaxSalary: (value: number) => void;
  skills: string[];
  setSkills: (value: string[]) => void;
  description: string;
  setDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
}

const JobDetails = ({
  setAction,
  title,
  setTitle,
  category,
  setCategory,
  department,
  setDepartment,
  openings,
  setOpenings,
  applicationRange,
  setApplicationRange,
  currency,
  setCurrency,
  minSalary,
  setMinSalary,
  maxSalary,
  setMaxSalary,
  skills,
  setSkills,
  description,
  setDescription,
  location,
  setLocation,
}: JobDetailsProps) => {
  const { organization } = useOutletContext() as RootContext;

  return (
    <div className="w-full">
      <Input
        label="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex gap-5 pt-7">
        <Select
          label="Job Category"
          selectedKeys={[category]}
          onChange={(e) => setCategory(e.target.value)}
        >
          <SelectItem value="full_time" key="full_time">
            Full Time
          </SelectItem>
          <SelectItem value="part_time" key="part_time">
            Part Time
          </SelectItem>
          <SelectItem value="contract" key="contract">
            Contract
          </SelectItem>
          <SelectItem value="internship" key="internship">
            Internship
          </SelectItem>
          <SelectItem value="temporary" key="temporary">
            Temporary
          </SelectItem>
        </Select>
        <Select
          label="Department"
          selectedKeys={[department]}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {(organization?.departments || [])?.map((department) => (
            <SelectItem value={department._id} key={department?._id || ""}>
              {department.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex gap-5 pt-7">
        <Input
          label="Openings"
          type="number"
          value={openings.toString()}
          onChange={(e) => setOpenings(Number(e.target.value))}
        />
        <DateRangePicker
          label="Application Period"
          value={applicationRange}
          onChange={setApplicationRange}
        />
      </div>
      <div className="flex gap-5 pt-7">
        <Select
          label="Currency"
          className="w-[30%]"
          selectedKeys={[currency]}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <SelectItem value="usd" key="usd">
            USD
          </SelectItem>
          <SelectItem value="eur" key="eur">
            EUR
          </SelectItem>
          <SelectItem value="gbp" key="gbp">
            GBP
          </SelectItem>
        </Select>
        <Input
          label="Min. Salary"
          type="number"
          value={minSalary.toString()}
          onChange={(e) => setMinSalary(Number(e.target.value))}
        />
        <Input
          label="Max. Salary"
          type="number"
          value={maxSalary.toString()}
          onChange={(e) => setMaxSalary(Number(e.target.value))}
        />
      </div>

      <div className="pt-7 gap-5 flex">
        <div className="w-full flex gap-5 items-center bg-input px-5 rounded-xl">
          <p className="text-gray-400">Skills</p>
          <TagsInput
            value={skills}
            onChange={setSkills}
            onlyUnique
            inputProps={{ placeholder: "Add a Skill" }}
          />
        </div>
        <Input
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <p className="mt-5 mb-3">Job Description</p>
      <ReactQuill
        theme="snow"
        value={description}
        onChange={setDescription}
        className="border rounded-xl bg-input max-w-[70vw] overflow-y-auto"
        placeholder="Job Description"
      />
      <Button
        variant="flat"
        color="success"
        endContent={<ChevronRight size={20} />}
        className="mt-5 float-right"
        onClick={() => setAction(1)}
      >
        Next
      </Button>
    </div>
  );
};

export default JobDetails;
