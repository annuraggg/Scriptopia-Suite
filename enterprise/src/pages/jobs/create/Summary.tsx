import {
  Divider,
  Chip,
  Button,
  ScrollShadow,
  RangeValue,
  DateValue,
} from "@nextui-org/react";
import {
  Building2,
  Calendar,
  Users,
  DollarSign,
  CheckCircle2,
  LocateIcon,
} from "lucide-react";

interface SummaryProps {
  setAction: (page: number) => void;
  title: string;
  category: string;
  department: string;
  openings: number;
  applicationRange: RangeValue<DateValue>;
  currency: string;
  minSalary: number;
  maxSalary: number;
  skills: string[];
  description: string;
  addedComponents: { id: string; name: string }[];
  location: string;
  handleSave: () => void;
}

const Preview = ({
  setAction,
  title,
  category,
  department,
  openings,
  applicationRange,
  currency,
  minSalary,
  maxSalary,
  skills,
  description,
  addedComponents,
  location,
  handleSave,
}: SummaryProps) => {
  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date.toString()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      fulltime: "success",
      parttime: "warning",
      contract: "primary",
      internship: "secondary",
      temporary: "danger",
    }; // @ts-ignore
    return colors[category] || "default";
  };

  const formatCurrency = (amount: string) => {
    const currencySymbols = {
      usd: "$",
      eur: "€",
      gbp: "£",
      rup: "₹",
    }; // @ts-ignore
    return `${currencySymbols[currency] || ""}${amount.toLocaleString()}`;
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="w-full">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
              {title || "Untitled Position"}
            </h1>
            <div className="flex gap-2 items-center my-5">
              <Chip color={getCategoryColor(category)} variant="flat" size="sm">
                {category?.charAt(0)?.toUpperCase() + category?.slice(1) ||
                  "No Category"}
              </Chip>
              <div className="flex items-center gap-1 text-sm opacity-70">
                <Building2 size={16} />
                <span>{department || "No Department"}</span>
              </div>
              <div className="flex items-center gap-1 text-sm opacity-70">
                <LocateIcon size={16} />
                <span>{location || "No Location"}</span>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-6 my-5">
          <div className="flex gap-4 flex-wrap">
            <Chip
              startContent={<Calendar size={16} />}
              variant="flat"
              className="h-8"
            >
              {formatDate(applicationRange?.start.toString())} -{" "}
              {formatDate(applicationRange?.end.toString())}
            </Chip>
            <Chip
              startContent={<Users size={16} />}
              variant="flat"
              className="h-8"
            >
              {openings} Opening{openings !== 1 ? "s" : ""}
            </Chip>
            <Chip
              startContent={<DollarSign size={16} />}
              variant="flat"
              className="h-8"
            >
              {formatCurrency(minSalary.toString())} -{" "}
              {formatCurrency(maxSalary.toString())}
            </Chip>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Required Skills</h2>
            <div className="flex gap-2 flex-wrap">
              {skills.map((skill, index) => (
                <Chip key={index} variant="flat" size="sm">
                  {skill}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <h2 className=" font-semibold mb-2 text-sm">Job Description</h2>
            <ScrollShadow className="max-h-64">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </ScrollShadow>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Assessment Workflow</h2>
            <div className="flex flex-col gap-3">
              {addedComponents.map((component, index) => (
                <div
                  key={component.id}
                  className="flex items-center gap-2 p-3 rounded-lg bg-content2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <span>{component.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="flat" onClick={() => setAction(1)}>
            Back
          </Button>
          <Button
            color="success"
            variant="flat"
            startContent={<CheckCircle2 size={16} />}
            onClick={handleSave}
          >
            Publish Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
