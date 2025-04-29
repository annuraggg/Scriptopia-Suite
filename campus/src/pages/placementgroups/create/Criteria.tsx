import { useState, useMemo, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Select,
  SelectItem,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import {
  Plus,
  Trash2,
  Filter,
  Eye,
  ListFilter,
  ChevronRight,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { PlacementGroupRule } from "@shared-types/PlacementGroup";
import { useOutletContext } from "react-router-dom";
import { RootContext } from "@/types/RootContext";
import { Department } from "@shared-types/Institute";

const DEGREE_TYPES = [
  { value: "secondary", label: "Secondary (10th)" },
  { value: "senior_secondary", label: "Senior Secondary (12th)" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD/Doctorate" },
  { value: "certificate", label: "Certificate Course" },
];

const EDUCATION_TYPES = [
  { value: "ssc", label: "SSC/10th Standard" },
  { value: "hsc", label: "HSC/12th Standard" },
  { value: "diploma", label: "Diploma" },
  { value: "graduate", label: "Bachelors/Graduation" },
  { value: "postgraduate", label: "Masters/Post-Graduation" },
  { value: "phd", label: "PhD/Doctorate" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Others" },
];

const EXPERIENCE_TYPES = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const generateGraduationYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 10; i > 0; i--) {
    const year = currentYear - i;
    years.push({ value: year.toString(), label: year.toString() });
  }

  years.push({ value: currentYear.toString(), label: currentYear.toString() });

  for (let i = 1; i <= 5; i++) {
    const year = currentYear + i;
    years.push({ value: year.toString(), label: year.toString() });
  }

  return years;
};

const GRADUATION_YEARS = generateGraduationYears();

const CATEGORY_OPTIONS = [
  { value: "basic", label: "Basic Information" },
  { value: "education", label: "Education" },
  { value: "work", label: "Work Experience" },
  { value: "projects", label: "Projects" },
  { value: "achievements", label: "Achievements" },
];

const SUBCATEGORY_OPTIONS: Record<
  string,
  Array<{ value: string; label: string }>
> = {
  basic: [
    { value: "age", label: "Age" },
    { value: "gender", label: "Gender" },
    { value: "location", label: "Location" },
  ],
  education: [
    { value: "degree", label: "Degree Type" },
    { value: "branch", label: "Branch/Department" },
    { value: "percentage", label: "Percentage" },
    { value: "graduationYear", label: "Graduation Year" },
    { value: "gaps", label: "Academic Gaps" },
    { value: "activeBacklogs", label: "Active Backlogs" },
    { value: "totalBacklogs", label: "Total Backlogs" },
  ],
  work: [
    { value: "experience", label: "Years of Experience" },
    { value: "experienceType", label: "Experience Type" },
  ],
  projects: [{ value: "projectCount", label: "Number of Projects" }],
  achievements: [
    { value: "certificateCount", label: "Number of Certificates" },
    { value: "awardCount", label: "Number of Awards" },
    { value: "scholarshipCount", label: "Number of Scholarships" },
    { value: "patentCount", label: "Number of Patents" },
  ],
};

interface CriteriaProps {
  setActiveStep: (step: number) => void;
  activeStep: number;
  rules: PlacementGroupRule[];
  setRules: (rules: PlacementGroupRule[]) => void;
}

const Criteria = ({
  setActiveStep,
  activeStep,
  rules,
  setRules,
}: CriteriaProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { institute } = useOutletContext<RootContext>();

  const [editingRule, setEditingRule] = useState<PlacementGroupRule | null>(
    null
  );

  const [formCategory, setFormCategory] = useState("basic");
  const [formSubcategory, setFormSubcategory] = useState("");
  const [formOperator, setFormOperator] = useState(">=");
  const [formValue, setFormValue] = useState("");
  const [formEducationType, setFormEducationType] = useState("");

  const resetModalForm = () => {
    setFormCategory("basic");
    setFormSubcategory("");
    setFormOperator(">=");
    setFormValue("");
    setFormEducationType("");
  };

  const addRule = (
    category: string,
    subcategory: string,
    operator: string,
    value: any,
    type?: string
  ) => {
    const newRule: PlacementGroupRule = {
      _id: Date.now().toString(),
      category,
      subcategory,
      operator,
      value,
      type,
      createdAt: new Date(),
    };
    setRules([...rules, newRule]);
    onClose();
    resetModalForm();
  };

  const updateRule = (
    category: string,
    subcategory: string,
    operator: string,
    value: string,
    educationType: string
  ) => {
    if (!editingRule?._id) return;

    const updatedRules = rules.map((rule) =>
      rule._id === editingRule._id
        ? {
            ...rule,
            category,
            subcategory,
            operator,
            value,
            type: educationType || undefined,
          }
        : rule
    );

    setRules(updatedRules);
    setEditingRule(null);
    onClose();
    resetModalForm();
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule._id !== ruleId));
  };

  const editRule = (rule: PlacementGroupRule) => {
    setEditingRule(rule);

    setFormCategory(rule.category);
    setFormSubcategory(rule.subcategory);
    setFormOperator(rule.operator);
    setFormValue(rule.value);
    setFormEducationType(rule.type || "");

    onOpen();
  };

  const openAddModal = () => {
    setEditingRule(null);
    resetModalForm();
    onOpen();
  };

  const handleModalClose = () => {
    setEditingRule(null);
    resetModalForm();
    onClose();
  };

  const getOperatorOptions = (subcategory: string) => {
    if (subcategory === "branch" || subcategory === "location") {
      return [
        { value: "contains", label: "Contains" },
        { value: "not_contains", label: "Does Not Contain" },
      ];
    } else if (
      subcategory === "gender" ||
      subcategory === "degree" ||
      subcategory === "experienceType" ||
      subcategory === "graduationYear"
    ) {
      return [
        { value: "=", label: "Equal to" },
        { value: "!=", label: "Not equal to" },
      ];
    }
    return [
      { value: "=", label: "Equal to" },
      { value: "!=", label: "Not equal to" },
      { value: ">", label: "Greater than" },
      { value: ">=", label: "Greater than or equal to" },
      { value: "<", label: "Less than" },
      { value: "<=", label: "Less than or equal to" },
    ];
  };

  useEffect(() => {
    if (formSubcategory) {
      if (
        formSubcategory === "gender" ||
        formSubcategory === "degree" ||
        formSubcategory === "experienceType"
      ) {
        setFormOperator("=");
      } else if (
        formSubcategory === "branch" ||
        formSubcategory === "location"
      ) {
        setFormOperator("contains");
      } else if (formSubcategory === "gaps") {
        setFormOperator("<=");
      } else {
        setFormOperator(">=");
      }
    }
  }, [formSubcategory]);

  const criteriaPreview = useMemo(() => {
    if (!formCategory || !formSubcategory || !formOperator || !formValue)
      return "";

    const getSubcategoryLabel = () => {
      return (
        SUBCATEGORY_OPTIONS[formCategory]?.find(
          (opt) => opt.value === formSubcategory
        )?.label || formSubcategory
      );
    };

    const getOperatorText = () => {
      const operatorMap: Record<string, string> = {
        "=": "equal to",
        "!=": "not equal to",
        ">": "greater than",
        ">=": "greater than or equal to",
        "<": "less than",
        "<=": "less than or equal to",
        contains: "contains",
        not_contains: "does not contain",
      };
      return operatorMap[formOperator] || formOperator;
    };

    const getEducationTypeLabel = () => {
      if (!formEducationType) return "";
      return (
        EDUCATION_TYPES.find((opt) => opt.value === formEducationType)?.label ||
        ""
      );
    };

    if (formSubcategory === "gender") {
      const genderLabel =
        GENDER_OPTIONS.find((g) => g.value === formValue)?.label || formValue;
      return `Candidate should be ${genderLabel}`;
    } else if (formSubcategory === "degree") {
      const degreeLabel =
        DEGREE_TYPES.find((d) => d.value === formValue)?.label || formValue;
      return `Candidate should have degree type ${
        formOperator === "=" ? "equal to" : "not equal to"
      } ${degreeLabel}`;
    } else if (formSubcategory === "experienceType") {
      const expTypeLabel =
        EXPERIENCE_TYPES.find((e) => e.value === formValue)?.label || formValue;
      return `Candidate should have experience type ${
        formOperator === "=" ? "equal to" : "not equal to"
      } ${expTypeLabel}`;
    } else if (formSubcategory === "graduationYear") {
      return `Candidate should have graduation year ${getOperatorText()} ${formValue}`;
    }

    const educationTypeText = formEducationType
      ? `${getEducationTypeLabel()} `
      : "";

    return `Candidate should have ${
      formSubcategory === "percentage" ? educationTypeText : ""
    }${getSubcategoryLabel()} ${getOperatorText()} ${formValue}`;
  }, [
    formCategory,
    formSubcategory,
    formOperator,
    formValue,
    formEducationType,
  ]);

  const renderValueInput = () => {
    if (formSubcategory === "gender") {
      return (
        <Select
          label="Gender"
          placeholder="Select gender"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          classNames={{
            label: "text-sm font-medium",
          }}
          variant="bordered"
          selectedKeys={formValue ? [formValue] : []}
        >
          {GENDER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      );
    } else if (formSubcategory === "degree") {
      return (
        <Select
          label="Degree Type"
          placeholder="Select degree type"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          classNames={{
            label: "text-sm font-medium",
          }}
          variant="bordered"
          selectedKeys={formValue ? [formValue] : []}
        >
          {DEGREE_TYPES.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      );
    } else if (formSubcategory === "branch") {
      return (
        <Select
          label="Branch/Department"
          placeholder="Select department"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          classNames={{
            label: "text-sm font-medium",
          }}
          variant="bordered"
          selectedKeys={formValue ? [formValue] : []}
        >
          {institute.departments?.map((department: Department) => (
            <SelectItem key={department._id} value={department.name}>
              {department.name}
            </SelectItem>
          ))}
        </Select>
      );
    } else if (formSubcategory === "experienceType") {
      return (
        <Select
          label="Experience Type"
          placeholder="Select experience type"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          classNames={{
            label: "text-sm font-medium",
          }}
          variant="bordered"
          selectedKeys={formValue ? [formValue] : []}
        >
          {EXPERIENCE_TYPES.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      );
    } else if (formSubcategory === "graduationYear") {
      return (
        <Select
          label="Graduation Year"
          placeholder="Select graduation year"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          classNames={{
            label: "text-sm font-medium",
          }}
          variant="bordered"
          selectedKeys={formValue ? [formValue] : []}
        >
          {GRADUATION_YEARS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      );
    } else {
      return (
        <Input
          label="Value"
          placeholder="Enter value"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          type={
            formSubcategory === "percentage" ||
            formSubcategory === "age" ||
            formSubcategory === "experience" ||
            formSubcategory === "projectCount" ||
            formSubcategory === "gaps" ||
            formSubcategory === "activeBacklogs" ||
            formSubcategory === "totalBacklogs" ||
            formSubcategory === "certificateCount" ||
            formSubcategory === "awardCount" ||
            formSubcategory === "scholarshipCount" ||
            formSubcategory === "patentCount"
              ? "number"
              : "text"
          }
          classNames={{
            label: "text-sm font-medium",
          }}
          variant="bordered"
        />
      );
    }
  };

  const renderRuleModal = () => {
    const isEditing = !!editingRule;

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 border-b">
            <h3 className="text-xl font-semibold">
              {isEditing ? "Edit Filter Criteria" : "Add Filter Criteria"}
            </h3>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Modify existing criteria"
                : "Define criteria to filter candidates"}
            </p>
          </ModalHeader>
          <ModalBody className="py-5">
            <div className="space-y-6">
              <Select
                label="Category"
                placeholder="Select a category"
                value={formCategory}
                onChange={(e) => {
                  setFormCategory(e.target.value);
                  setFormSubcategory("");
                  setFormOperator(">=");
                  setFormValue("");
                  setFormEducationType("");
                }}
                classNames={{
                  label: "text-sm font-medium",
                }}
                variant="bordered"
                selectedKeys={[formCategory]}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Subcategory"
                placeholder="Select a subcategory"
                value={formSubcategory}
                onChange={(e) => {
                  setFormSubcategory(e.target.value);
                  setFormValue("");

                  if (
                    e.target.value === "branch" ||
                    e.target.value === "location"
                  ) {
                    setFormOperator("contains");
                  } else if (
                    e.target.value === "gender" ||
                    e.target.value === "degree" ||
                    e.target.value === "experienceType"
                  ) {
                    setFormOperator("=");
                  } else if (e.target.value === "gaps") {
                    setFormOperator("<=");
                  } else {
                    setFormOperator(">=");
                  }
                }}
                isDisabled={!formCategory}
                classNames={{
                  label: "text-sm font-medium",
                }}
                variant="bordered"
                selectedKeys={formSubcategory ? [formSubcategory] : []}
              >
                {formCategory
                  ? SUBCATEGORY_OPTIONS[formCategory]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  : null}
              </Select>

              {formSubcategory === "percentage" && (
                <Select
                  label="Education Type"
                  placeholder="Select education type"
                  value={formEducationType}
                  onChange={(e) => setFormEducationType(e.target.value)}
                  classNames={{
                    label: "text-sm font-medium",
                  }}
                  variant="bordered"
                  selectedKeys={formEducationType ? [formEducationType] : []}
                >
                  {EDUCATION_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              )}

              {formSubcategory && (
                <Select
                  label="Operator"
                  placeholder="Select an operator"
                  value={formOperator}
                  onChange={(e) => setFormOperator(e.target.value)}
                  classNames={{
                    label: "text-sm font-medium",
                  }}
                  variant="bordered"
                  selectedKeys={[formOperator]}
                >
                  {getOperatorOptions(formSubcategory).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              )}

              {formSubcategory && renderValueInput()}

              {criteriaPreview && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardBody className="py-3 px-4">
                    <div className="flex items-start gap-3">
                      <Eye size={18} className="text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium">
                          Preview
                        </p>
                        <p className="text-sm text-blue-600">
                          {criteriaPreview}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="border-t">
            <Button color="danger" variant="flat" onPress={handleModalClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => {
                if (
                  formCategory &&
                  formSubcategory &&
                  formOperator &&
                  formValue
                ) {
                  if (isEditing) {
                    updateRule(
                      formCategory,
                      formSubcategory,
                      formOperator,
                      formValue,
                      formEducationType
                    );
                  } else {
                    addRule(
                      formCategory,
                      formSubcategory,
                      formOperator,
                      formValue,
                      formEducationType || undefined
                    );
                  }
                }
              }}
              startContent={isEditing ? <Save size={18} /> : <Plus size={18} />}
              isDisabled={
                !formCategory || !formSubcategory || !formOperator || !formValue
              }
            >
              {isEditing ? "Update Criteria" : "Add Criteria"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const getRuleSummary = (rule: PlacementGroupRule): string => {
    const operatorMap: Record<string, string> = {
      "=": "equal to",
      "!=": "not equal to",
      ">": "greater than",
      ">=": "greater than or equal to",
      "<": "less than",
      "<=": "less than or equal to",
      contains: "contains",
      not_contains: "does not contain",
    };

    let categoryLabel =
      rule.category.charAt(0).toUpperCase() + rule.category.slice(1);
    let subcategoryLabel =
      rule.subcategory.charAt(0).toUpperCase() +
      rule.subcategory.slice(1).replace(/([A-Z])/g, " $1");
    let typePrefix = rule.type ? `${rule.type.toUpperCase()} ` : "";

    if (rule.subcategory === "gender") {
      const genderLabel =
        GENDER_OPTIONS.find((g) => g.value === rule.value)?.label || rule.value;
      return `${categoryLabel} - Gender is ${genderLabel}`;
    } else if (rule.subcategory === "degree") {
      const degreeLabel =
        DEGREE_TYPES.find((d) => d.value === rule.value)?.label || rule.value;
      return `${categoryLabel} - Degree Type ${
        rule.operator === "=" ? "is" : "is not"
      } ${degreeLabel}`;
    } else if (rule.subcategory === "experienceType") {
      const expTypeLabel =
        EXPERIENCE_TYPES.find((e) => e.value === rule.value)?.label ||
        rule.value;
      return `${categoryLabel} - Experience Type ${
        rule.operator === "=" ? "is" : "is not"
      } ${expTypeLabel}`;
    }

    return `${categoryLabel} - ${typePrefix}${subcategoryLabel} ${
      operatorMap[rule.operator]
    } ${rule.value}`;
  };

  const getHumanReadableRule = (rule: PlacementGroupRule): string => {
    const operatorMap: Record<string, string> = {
      "=": "equal to",
      "!=": "not equal to",
      ">": "greater than",
      ">=": "greater than or equal to",
      "<": "less than",
      "<=": "less than or equal to",
      contains: "contains",
      not_contains: "does not contain",
    };

    let subcategoryLabel =
      rule.subcategory.charAt(0).toUpperCase() +
      rule.subcategory.slice(1).replace(/([A-Z])/g, " $1");

    let typePrefix = "";
    if (rule.type) {
      const educationTypeMap: Record<string, string> = {
        ssc: "SSC/10th",
        hsc: "HSC/12th",
        diploma: "Diploma",
        graduate: "Graduation",
        postgraduate: "Post-Graduation",
        phd: "PhD",
      };
      typePrefix = `${educationTypeMap[rule.type] || rule.type.toUpperCase()} `;
    }

    if (rule.subcategory === "gender") {
      const genderLabel =
        GENDER_OPTIONS.find((g) => g.value === rule.value)?.label || rule.value;
      return `Candidate should be ${genderLabel}`;
    } else if (rule.subcategory === "degree") {
      const degreeLabel =
        DEGREE_TYPES.find((d) => d.value === rule.value)?.label || rule.value;
      return `Candidate should have a degree type ${
        rule.operator === "=" ? "equal to" : "not equal to"
      } ${degreeLabel}`;
    } else if (rule.subcategory === "experienceType") {
      const expTypeLabel =
        EXPERIENCE_TYPES.find((e) => e.value === rule.value)?.label ||
        rule.value;
      return `Candidate should have experience type ${
        rule.operator === "=" ? "equal to" : "not equal to"
      } ${expTypeLabel}`;
    }

    return `Candidate should have ${
      rule.subcategory === "percentage" ? typePrefix : ""
    }${subcategoryLabel} ${operatorMap[rule.operator]} ${rule.value}`;
  };

  const renderRuleChips = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {rules.length === 0 && (
          <p className="text-gray-500 italic">
            No criteria defined. Add criteria to filter candidates.
          </p>
        )}

        {rules?.map((rule) => (
          <Chip
            key={rule._id}
            variant="flat"
            color={getCategoryColor(rule.category)}
            className="py-2 px-3"
            startContent={
              <div className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
            }
            endContent={
              <div className="flex items-center gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => editRule(rule)}
                  className="ml-1"
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => deleteRule(rule._id || "")}
                  className="-mr-1"
                >
                  <X size={14} />
                </Button>
              </div>
            }
          >
            {getRuleSummary(rule)}
          </Chip>
        ))}
      </div>
    );
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<
      string,
      "default" | "primary" | "secondary" | "success" | "warning" | "danger"
    > = {
      basic: "default",
      education: "primary",
      work: "success",
      projects: "warning",
      achievements: "danger",
    };
    return colorMap[category] || "default";
  };

  const renderNoCriteriaState = () => {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <Filter size={48} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-600">
          No Criteria Defined
        </h3>
        <p className="text-gray-500 mt-2 max-w-md">
          Add criteria to filter candidates for this placement group. Click the
          "Add Criteria" button to get started.
        </p>
        <Button
          color="primary"
          className="mt-6"
          startContent={<Plus size={18} />}
          onPress={openAddModal}
        >
          Add Criteria
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Placement Group Criteria</h1>
            <p className="text-gray-500 text-sm mt-1">
              Define criteria to filter candidates for placement groups
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              startContent={<Plus size={18} />}
              onPress={openAddModal}
              size="md"
            >
              Add Criteria
            </Button>

            <Button
              color="danger"
              startContent={<Trash2 size={16} />}
              isDisabled={rules.length === 0}
              onPress={() => setRules([])}
            >
              Clear All
            </Button>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="flex justify-between items-center bg-gray-50/80 border-b">
            <div className="flex items-center gap-2">
              <ListFilter size={18} className="text-primary" />
              <h2 className="text-lg font-semibold">Active Criterias</h2>
            </div>
            <div className="flex items-center gap-3">
              <Chip color="primary" variant="flat" size="sm">
                {rules.length} criteria
              </Chip>
              {rules.length > 0 && (
                <Tooltip content="Clear all criteria">
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => setRules([])}
                  >
                    <Trash2 size={16} />
                  </Button>
                </Tooltip>
              )}
            </div>
          </CardHeader>
          <CardBody className="py-5">
            {rules.length > 0 ? renderRuleChips() : renderNoCriteriaState()}
          </CardBody>
        </Card>

        {rules.length > 0 && (
          <Card className="shadow-sm bg-blue-50 border-blue-200">
            <CardHeader className="bg-blue-100/80 border-b border-blue-200 flex gap-2 py-3">
              <Eye size={18} className="text-blue-600" />
              <h3 className="font-semibold text-blue-700">Criteria Preview</h3>
            </CardHeader>
            <CardBody className="py-4">
              <ul className="list-disc pl-5 space-y-2">
                {rules?.map((rule) => (
                  <li key={rule._id} className="text-blue-700">
                    {getHumanReadableRule(rule)}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        <div className="flex items-center gap-5 justify-end mt-5">
          <Button
            variant="flat"
            color="danger"
            onPress={() => setActiveStep(activeStep - 1)}
          >
            Back
          </Button>
          <Button
            variant="flat"
            color="success"
            endContent={<ChevronRight size={20} />}
            onPress={() => setActiveStep(activeStep + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {renderRuleModal()}
    </div>
  );
};

export default Criteria;
