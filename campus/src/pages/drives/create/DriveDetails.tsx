import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import type { DateValue } from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";
import { DatePicker } from "@heroui/date-picker";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { RootContext } from "@/types/RootContext";
import currencyData from "@/data/currency";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";

interface DriveDetailsProps {
  setAction: Dispatch<SetStateAction<number>>;
  title: string;
  setTitle: (value: string) => void;
  link: string;
  setLink: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
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
  description: Record<string, unknown>;
  setDescription: (value: Record<string, unknown>) => void;
  location: string;
  setLocation: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
}

const DriveDetails = ({
  setAction,
  title,
  setTitle,
  link,
  setLink,
  category,
  setCategory,
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
  company,
  setCompany,
}: DriveDetailsProps) => {
  const { institute } = useOutletContext() as RootContext;

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="text-sm w-[30%]">
          <p>Drive Title</p>
          <p className="opacity-50">
            A Drive Title that must describe one position only
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

      <div className="flex justify-between  mt-7">
        <div className="text-sm w-[30%]">
          <p>Application Link</p>
          <p className="opacity-50">Link to the application form or website.</p>
        </div>
        <div>
          <Input
            placeholder="eg. https://example.com/apply"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-[500px]"
          />
        </div>
      </div>

      <div className="flex justify-between mt-7">
        <div className="text-sm w-[30%]">
          <p>Associated Company</p>
          <p className="opacity-50">
            Choose the company that is associated with this drive. If not
            listed, please create a new company profile first.
          </p>
        </div>
        <div>
          <Autocomplete
            label="Company"
            selectedKey={company}
            onSelectionChange={(e) => setCompany(e?.toString() || "")}
            className="max-w-[300px]"
          >
            {institute?.companies?.map((company) => (
              <AutocompleteItem key={company?._id || ""}>
                {company.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
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
            <SelectItem key="full_time">Full Time</SelectItem>
            <SelectItem key="part_time">Part Time</SelectItem>
            <SelectItem key="contract">Contract</SelectItem>
            <SelectItem key="internship">Internship</SelectItem>
            <SelectItem key="temporary">Temporary</SelectItem>
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
          <Autocomplete
            label="Currency"
            className="w-[400px]"
            selectedKey={currency}
            onSelectionChange={(e) => setCurrency(e?.toString() || "")}
            isVirtualized
          >
            {currencyData.map((c) => (
              <AutocompleteItem key={c.currency_code}>
                {c.currency_code}
              </AutocompleteItem>
            ))}
          </Autocomplete>
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
        <div className="flex gap-3 max-w-[500px]">
          <DatePicker
            className="w-[500px]"
            value={applicationRange?.start as DateValue}
            aria-label="Start"
            label="Entry Starts"
            onChange={(e) => {
              if (!e) return;
              setApplicationRange({ ...applicationRange, start: e });
            }}
          />
          <DatePicker
            className="w-[500px]"
            value={applicationRange?.end as DateValue}
            aria-label="End"
            label="Entry Ends"
            onChange={(e) => {
              if (!e) return;
              setApplicationRange({ ...applicationRange, end: e });
            }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-7">
        <div className="text-sm w-[30%]">
          <p>Location</p>
          <p className="opacity-50">
            Choose the location where the drive will be based at. For remote
            drives, write "Remote" or "Anywhere" Choose the location where the
            drive will be based at. For remote drives, write "Remote" or
            "Anywhere"
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
