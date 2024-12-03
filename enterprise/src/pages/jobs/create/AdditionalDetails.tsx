import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Checkbox,
  Button,
} from "@nextui-org/react";

type FieldKey = string;

interface AdditionalDetailsProps {
  setAction: React.Dispatch<React.SetStateAction<number>>;
  required: FieldKey[];
  allowedEmpty: FieldKey[];
  onRequiredChange: (fields: FieldKey[]) => void;
  onAllowedEmptyChange: (fields: FieldKey[]) => void;
}

interface CategoryFields {
  [key: string]: string[];
}

const FIELD_CATEGORIES: CategoryFields = {
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
  onRequiredChange: (fields: FieldKey[]) => void;
  onAllowedEmptyChange: (fields: FieldKey[]) => void;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  setAction,
  required,
  allowedEmpty,
  onRequiredChange,
  onAllowedEmptyChange,
}) => {
  const handleRequiredToggle = (field: string) => {
    const newRequired = required.includes(field)
      ? required.filter((f) => f !== field)
      : [...required, field];

    onRequiredChange(newRequired);

    // If field is being unchecked from required, also remove it from allowedEmpty
    if (required.includes(field)) {
      onAllowedEmptyChange(allowedEmpty.filter((f) => f !== field));
    }
  };

  const handleAllowedEmptyToggle = (field: string) => {
    const newAllowedEmpty = allowedEmpty.includes(field)
      ? allowedEmpty.filter((f) => f !== field)
      : [...allowedEmpty, field];

    onAllowedEmptyChange(newAllowedEmpty);
  };

  const FieldSection: React.FC<FieldSectionProps> = ({
    title,
    fields,
    required,
    allowedEmpty,
    onRequiredChange,
    onAllowedEmptyChange,
  }) => (
    <div className="shadow-sm rounded-xl border overflow-hidden mb-6">
      <div className="px-6 py-4 border-b">
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
                {field.replace(/([A-Z])/g, " $1").trim()}
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
    <div className="px-4">
      <div className="rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Additional Details Configuration
        </h2>
        <div className="space-y-4 mb-6">
          <p>
            We can collect the following information from the candidate. Please
            configure which fields are required and which can be left empty.
          </p>

          <div className="border rounded-lg p-4">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Required Field:</span> The
                candidate must provide at least one entry for this field.
              </p>
              <p>
                <span className="font-semibold">Allow Empty:</span> If the field
                is required, you can still allow it to be empty (e.g., if
                certificates are required but a candidate with no certificates
                should still be able to apply). This option is only available
                for required fields.
              </p>
            </div>
          </div>
        </div>

        {Object.entries(FIELD_CATEGORIES).map(([category, fields]) => (
          <FieldSection
            key={category}
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            fields={fields}
            required={required}
            allowedEmpty={allowedEmpty}
            onRequiredChange={onRequiredChange}
            onAllowedEmptyChange={onAllowedEmptyChange}
          />
        ))}

        <div className="flex justify-end mt-8">
          <Button onClick={() => setAction(2)}>Next Step</Button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetails;
