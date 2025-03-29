import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import type { DateValue } from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";

import {
  Calendar,
  Users,
  DollarSign,
  CheckCircle2,
  Edit2,
  Trash2,
} from "lucide-react";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useEffect, useState } from "react";
import { Divider } from "@heroui/divider";

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
  description: Record<string, unknown>;
  addedComponents: { id: string; name: string }[];
  location: string;
  handleSave: () => void;
}

const Preview = ({
  setAction,
  title,
  category,
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
  const [parsedDescription, setParsedDescription] = useState<string>("");

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date.toString()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const cleanCategory = (category: string) => {
    const cleaned = category.replace("_", " ");
    const titleCase = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return titleCase;
  };

  useEffect(() => {
    const delta = description;
    if (!delta) return;

    const html = new QuillDeltaToHtmlConverter(delta.ops as any, {});
    setParsedDescription(html.convert());
  }, []);

  return (
    <div className="w-full max-w-5xl px-4 py-6">
      <div className="w-full space-y-6">
        {/* Job Title and Basic Info */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {title || "Untitled Position"}
            </h1>
            <div className="flex gap-2">
              <div className="text-sm opacity-70">
                <span>{cleanCategory(category) || "No Category"}</span>
              </div>
              <div className="text-sm opacity-70">
                <span>{location || "No Location"}</span>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Job Details */}
        <div className="space-y-6">
          {/* Key Information Chips */}
          <div className="flex gap-4 flex-wrap">
            {[
              {
                icon: <Calendar size={16} />,
                content: `${formatDate(
                  applicationRange?.start.toString()
                )} - ${formatDate(applicationRange?.end.toString())}`,
              },
              {
                icon: <Users size={16} />,
                content: `${openings} Opening${openings !== 1 ? "s" : ""}`,
              },
              {
                icon: <DollarSign size={16} />,
                content: `${formatCurrency(
                  minSalary.toString()
                )} - ${formatCurrency(maxSalary.toString())}`,
              },
            ].map((item, index) => (
              <Chip
                key={index}
                startContent={item.icon}
                variant="flat"
                className="h-8 px-3 transition-all duration-300 hover:scale-105"
              >
                {item.content}
              </Chip>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Required Skills</h2>
            <div className="flex gap-2 flex-wrap">
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  variant="flat"
                  size="sm"
                  className="transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </Chip>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Job Description</h2>
            <ScrollShadow className="max-h-64">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: parsedDescription }}
              />
            </ScrollShadow>
          </div>

          {/* Assessment Workflow */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Assessment Workflow</h2>
            <div className="space-y-3">
              {addedComponents.map((component, index) => (
                <div
                  key={component.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-content2 transition-all duration-300 hover:shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {component.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="hover:bg-content3 rounded-full p-1">
                      <Edit2 size={16} />
                    </button>
                    <button className="hover:bg-content3 rounded-full p-1">
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="flat"
            onClick={() => setAction(1)}
            className="transition-all duration-300 hover:scale-105"
          >
            Back
          </Button>
          <Button
            color="success"
            variant="flat"
            startContent={<CheckCircle2 size={16} />}
            onClick={handleSave}
            className="transition-all duration-300 hover:scale-105"
          >
            Publish Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
