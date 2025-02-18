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

interface DriveDetailsProps {
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

const DriveDetails = ({
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
}: DriveDetailsProps) => {
  const { institute } = useOutletContext() as RootContext;

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="text-sm w-[30%]">
          <p>Job Title</p>
          <p className="opacity-50">
            A Job Title that must describe one position only
          </p>
        </div>
        <div>
          <Input
            placeholder="eg. Senior Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[500px]"
          />
        </div>
      </div>

      <div className="flex justify-between mt-7">
        <div className="text-sm w-[30%]">
          <p>Drive Description</p>
          <p className="opacity-50">
            Provide a short description of the drive. Keep it short and to the
            point.
          </p>
        </div>
        <div>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={(_e, _d, _s, ed) => setDescription(ed.getContents())}
            className="border rounded-xl bg-input w-[500px] overflow-y-auto"
            placeholder="eg. We are looking for a Senior Software Engineer to join our team. You will be responsible for building high-quality software applications."
          />
        </div>
      </div>

      <div className="flex justify-between mt-7">
        <div className="text-sm w-[30%]">
          <p>Employment Type</p>
          <p className="opacity-50">
            Select the type of employment for this drive
          </p>
        </div>
        <div className="flex flex-col items-end">
          <Select
            label="Drive Category"
            selectedKeys={[category]}
            onChange={(e) => setCategory(e.target.value)}
            className="w-[500px]"
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
            className="max-w-[300px] mt-3"
          >
            {(institute?.departments || [])?.map((department) => (
              <SelectItem value={department._id} key={department?._id || ""}>
                {department.name}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Openings"
            type="number"
            className="w-[300px] mt-3"
            value={openings.toString()}
            onChange={(e) => setOpenings(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex justify-between mt-7">
        <div className="text-sm w-[30%]">
          <p>Salary</p>
          <p className="opacity-50">
            Choose how much you prefer to pay for this drive
          </p>
        </div>
        <div className="flex w-[500px] gap-3">
          <Select
            label="Currency"
            className="w-[400px]"
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
      </div>

      <div className="flex justify-between mt-7">
        <div className="text-sm w-[30%]">
          <p>Application Range</p>
          <p className="opacity-50">
            Choose the period when the drive will be open for applications
          </p>
        </div>
        <div>
          <DateRangePicker
            className="w-[500px]"
            value={applicationRange}
            onChange={setApplicationRange}
          />
        </div>
      </div>

      <div className="flex justify-between mt-7">
        <div className="text-sm w-[30%]">
          <p>Location</p>
          <p className="opacity-50">
            Choose the location where the job will be based at. For remote drives,
            write "Remote" or "Anywhere"
          </p>
        </div>
        <div>
          <Input
            placeholder="eg. New York, USA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between mt-7">
        <div className="text-sm w-[30%]">
          <p>Skills</p>
          <p className="opacity-50">
            Choose the skills that are required for this drive. You can add as
            many as you want
          </p>
        </div>

        <div className="w-[300px]">
          <TagsInput
            value={skills}
            onChange={setSkills}
            onlyUnique
            inputProps={{ placeholder: "Add a Skill" }}
          />
        </div>
      </div>

      <Button
        variant="flat"
        color="success"
        endContent={<ChevronRight size={20} />}
        className="mt-5 float-right"
        onClick={() => setAction(1)}
      >
        Next
      </Button>

      <div className="mb-5">&nbsp;</div>
    </div>
  );
};

export default DriveDetails;
