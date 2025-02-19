import { useState } from "react";
import Sidebar from "./Sidebar";
import DriveDetails from "./DriveDetails";
import Workflow from "./Workflow";
import { DateValue, RangeValue } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import Summary from "./Summary";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Drive, AdditionalDetails as AdditionalDetailsType, StepType } from "@shared-types/Drive";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import AdditionalDetails, { FIELD_CATEGORIES } from "./AdditionalDetails";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RootContext } from "@/types/RootContext";

interface Component {
  icon: React.ElementType;
  label: string;
  name: string;
  id: string;
}

const componentMap: Record<string, StepType> = {
  "ATS": "rs",
  "MCQ Assessment": "mcqa",
  "Code Assessment": "ca",
  "MCQ + Code Assessment": "mcqca",
  "Assignment": "as",
  "OfferLetter": "ol",
  "Interview": "pi",
};

const CreateDrive = () => {
  const [active, setActive] = useState(0);

  // Job Details States
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [openings, setOpenings] = useState<number>(0);
  const [applicationRange, setApplicationRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });
  const [currency, setCurrency] = useState<string>("");
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");

  // Additional Details States
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [allowNoEntries, setAllowNoEntries] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetailsType>({});

  // Workflow States
  const [addedComponents, setAddedComponents] = useState<Component[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [loading, setLoading] = useState(false);
  const { institute, setInstitute } = useOutletContext() as RootContext;
  const navigate = useNavigate();

  const handleSave = () => {
    setLoading(true);

    const formattedData = {
      steps: addedComponents.map((component) => ({
        name: component.label, // @ts-ignore
        type: componentMap[component.label] as
          | "rs"
          | "mcqa"
          | "ca"
          | "mcqca"
          | "as"
          | "pi"
          | "ol"
          | "cu",
        completed: false,
        timestamp: new Date(),
      })),
      currentStep: -1,
    };

    // Format additional details
    const formattedAdditionalDetails: { [key: string]: { [key: string]: { required: boolean; allowEmpty: boolean } } } = {};
    Object.entries(FIELD_CATEGORIES).forEach(([category, fields]) => {
      formattedAdditionalDetails[category] = {};
      fields.forEach((field) => {
        formattedAdditionalDetails[category][field] = {
          required: requiredFields.includes(field),
          allowEmpty: allowNoEntries.includes(field),
        };
      });
    });

    const drive: Drive = {
      title,
      description,
      department,
      location,
      type: category as
        | "full_time"
        | "part_time"
        | "internship"
        | "contract"
        | "temporary",
      openings,

      applicationRange: {
        start: applicationRange.start.toDate(getLocalTimeZone()),
        end: applicationRange.end.toDate(getLocalTimeZone()),
      },
      skills,
      salary: {
        min: minSalary,
        max: maxSalary,
        currency,
      },
      workflow: formattedData,
      additionalDetails: formattedAdditionalDetails,
      published: false,
    };

    axios
      .post("/drives", drive)
      .then((res) => {
        toast.success("Drive created successfully");
        const newInstitute = { ...institute };
        newInstitute.drives.push(res.data.data);
        setInstitute(newInstitute);
        console.log(newInstitute);
        navigate("/drives");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to create drive");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loader />;

  return (
    <div className="flex h-screen">
      <Sidebar active={active} setActive={setActive} />
      <div className="float-right overflow-y-auto w-full px-10 py-10">
        {active === 0 && (
          <DriveDetails
            setAction={setActive}
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            department={department}
            setDepartment={setDepartment}
            openings={openings}
            setOpenings={setOpenings}
            applicationRange={applicationRange}
            setApplicationRange={setApplicationRange}
            currency={currency}
            setCurrency={setCurrency}
            minSalary={minSalary}
            setMinSalary={setMinSalary}
            maxSalary={maxSalary}
            setMaxSalary={setMaxSalary}
            skills={skills}
            setSkills={setSkills}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
          />
        )}
        {active === 1 && (
          <AdditionalDetails
            setAction={setActive}
            required={requiredFields}
            onRequiredChange={setRequiredFields}
            allowedEmpty={allowNoEntries}
            onAllowedEmptyChange={setAllowNoEntries}
            additionalDetails={additionalDetails}
            setAdditionalDetails={setAdditionalDetails}
          />
        )}
        {active === 2 && (
          <Workflow
            setAction={setActive}
            addedComponents={addedComponents}
            setAddedComponents={setAddedComponents}
          />
        )}
        {active === 3 && (
          <Summary
            setAction={setActive}
            title={title}
            category={category}
            department={department}
            openings={openings}
            applicationRange={applicationRange}
            currency={currency}
            minSalary={minSalary}
            maxSalary={maxSalary}
            skills={skills}
            description={description}
            addedComponents={addedComponents}
            location={location}
            handleSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default CreateDrive;
