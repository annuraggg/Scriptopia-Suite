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
  }) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <Table
        aria-label={`${title} configuration`}
        classNames={{
          wrapper: "min-h-[0px]",
          th: "bg-transparent",
          td: "py-3",
          tr: "border-b-0",
        }}
        radius="sm"
      >
        <TableHeader>
          <TableColumn>Field</TableColumn>
          <TableColumn className="text-right pr-16">Required</TableColumn>
          <TableColumn className="text-right pr-8">Allow Empty</TableColumn>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field}>
              <TableCell className="capitalize w-1/2">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end pr-12">
                  <Checkbox
                    isSelected={required.includes(field)}
                    onValueChange={() => handleRequiredToggle(field)}
                    size="sm"
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end pr-4">
                  <Checkbox
                    isSelected={allowedEmpty.includes(field)}
                    onValueChange={() => handleAllowedEmptyToggle(field)}
                    isDisabled={!required.includes(field)}
                    size="sm"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="py-5 space-y-6">
      <div className="space-y-4 opacity-70">
        <p>
          We additionally can collect the following information from the
          candidate. Please configure which fields are required and which can be
          left empty.
        </p>

        <div>
          <p>
            <span className="font-semibold">Required Field:</span> The candidate
            must provide at least one entry for this field.
          </p>
          <p>
            <span className="font-semibold">Allow Empty:</span> If the field is
            required, you can still allow it to be empty (e.g., if certificates
            are required but a candidate with no certificates should still be
            able to apply). This option is only available for required fields.
          </p>
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
      <Button variant="flat" color="success" onClick={() => setAction(2)} className="float-right">
        Next
      </Button>
    </div>
  );
};

export default AdditionalDetails;
