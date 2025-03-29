import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { ChevronRight, Info } from "lucide-react";
import { AdditionalDetails as AdditionalDetailsType } from "@shared-types/Drive";

type FieldKey = string;

interface AdditionalDetailsProps {
  setAction: React.Dispatch<React.SetStateAction<number>>;
  required: string[];
  allowedEmpty: string[];
  onRequiredChange: (fields: string[]) => void;
  onAllowedEmptyChange: (fields: string[]) => void;
  additionalDetails: AdditionalDetailsType;
  setAdditionalDetails: React.Dispatch<
    React.SetStateAction<AdditionalDetailsType>
  >;
}

interface CategoryFields {
  [key: string]: string[];
}

export const FIELD_CATEGORIES: CategoryFields = {
  basic: ["summary"],
  links: ["socialLinks"],
  background: ["education", "workExperience"],
  skills: ["technicalSkills", "languages", "subjects"],
  experience: ["responsibilities", "projects"],
  achievements: ["awards", "certificates", "competitions"],
  professional: ["conferences", "patents", "scholarships"],
  activities: ["volunteerings", "extraCurriculars"],
};

interface FieldSectionProps {
  title: string;
  fields: string[];
  required: FieldKey[];
  allowedEmpty: FieldKey[];
  onRequiredChange: (fields: string[]) => void;
  onAllowedEmptyChange: (fields: string[]) => void;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  setAction,
  required,
  allowedEmpty,
  onRequiredChange,
  onAllowedEmptyChange,
  additionalDetails,
  setAdditionalDetails,
}) => {
  React.useEffect(() => {
    const initialRequired: string[] = [];
    const initialAllowEmpty: string[] = [];

    Object.entries(additionalDetails).forEach(([_, fields]) => {
      Object.entries(fields).forEach(([field, config]) => {
        if ((config as { required: boolean }).required) {
          initialRequired.push(field);
        }
        if ((config as { allowEmpty: boolean }).allowEmpty) {
          initialAllowEmpty.push(field);
        }
      });
    });

    if (initialRequired.length > 0) {
      onRequiredChange(initialRequired);
    }
    if (initialAllowEmpty.length > 0) {
      onAllowedEmptyChange(initialAllowEmpty);
    }
  }, [additionalDetails, onRequiredChange, onAllowedEmptyChange]);

  const handleRequiredToggle = (field: string) => {
    const newRequired = required.includes(field)
      ? required.filter((f) => f !== field)
      : [...required, field];

    onRequiredChange(newRequired);

    // If field is being unchecked from required, also remove it from allowedEmpty
    if (required.includes(field)) {
      onAllowedEmptyChange(allowedEmpty.filter((f) => f !== field));
    }

    const category = Object.entries(FIELD_CATEGORIES).find(([_, fields]) =>
      fields.includes(field)
    )?.[0];

    if (category) {
      setAdditionalDetails((prev: AdditionalDetailsType) => ({
        ...prev,
        [category]: {
          // @ts-expect-error - TS doesn't know that category is a valid key
          ...prev[category],
          [field]: {
            required: !required.includes(field),
            allowEmpty: false,
          },
        },
      }));
    }
  };

  const handleAllowedEmptyToggle = (field: string) => {
    const newAllowedEmpty = allowedEmpty.includes(field)
      ? allowedEmpty.filter((f) => f !== field)
      : [...allowedEmpty, field];

    onAllowedEmptyChange(newAllowedEmpty);

    const category = Object.entries(FIELD_CATEGORIES).find(([_, fields]) =>
      fields.includes(field)
    )?.[0];

    if (category) {
      setAdditionalDetails((prev: AdditionalDetailsType) => ({
        ...prev,
        [category]: {
          // @ts-expect-error - TS doesn't know that category is a valid key
          ...prev[category],
          [field]: {
            required: required.includes(field),
            allowEmpty: !allowedEmpty.includes(field),
          },
        },
      }));
    }
  };

  const FieldSection: React.FC<FieldSectionProps> = ({
    title,
    fields,
    required,
    allowedEmpty,
  }) => (
    <div className="overflow-hidden mb-6">
      <div className="px-6 py-4 rounded-xl">
        <h3 className="text-xl font-semibold capitalize">{title}</h3>
      </div>
      <Table
        aria-label={`${title} configuration`}
        classNames={{
          wrapper: "p-0",
          th: "font-medium uppercase tracking-wider",
          td: "py-4 px-6",
          tr: "transition-colors duration-200",
        }}
        radius="none"
      >
        <TableHeader>
          <TableColumn className="text-left pl-6">Field</TableColumn>
          <TableColumn className="text-center">Required</TableColumn>
          <TableColumn className="text-center">Allow Empty</TableColumn>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field}>
              <TableCell className="font-medium">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .slice(0, 1)
                  .toUpperCase() +
                  field
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .slice(1)}
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  isSelected={required.includes(field)}
                  onValueChange={() => handleRequiredToggle(field)}
                  size="sm"
                  color="warning"
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  isSelected={allowedEmpty.includes(field)}
                  onValueChange={() => handleAllowedEmptyToggle(field)}
                  isDisabled={!required.includes(field)}
                  size="sm"
                  color="warning"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4"
    >
      <div className="rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Additional Details Configuration
        </h2>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 mt-1 text-blue-500" />
            <p className="text-gray-600">
              Configure which candidate information fields are required and
              which can be left empty.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Required Field:</span> The
                candidate must provide at least one entry for this field.
              </p>
              <p>
                <span className="font-semibold">Allow Empty:</span> If the field
                is required, you can still allow it to be empty.
              </p>
            </div>
          </div>
        </div>

        {Object.entries(FIELD_CATEGORIES).map(([category, fields]) => (
          <FieldSection
            key={category}
            title={category}
            fields={fields}
            required={required}
            allowedEmpty={allowedEmpty}
            onRequiredChange={onRequiredChange}
            onAllowedEmptyChange={onAllowedEmptyChange}
          />
        ))}

        <div className="flex justify-end mt-8 gap-4">
          <Button variant="bordered" onClick={() => setAction(0)}>
            Previous
          </Button>

          <Button
            variant="flat"
            color="success"
            endContent={<ChevronRight size={20} />}
            onClick={() => setAction(2)}
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdditionalDetails;
