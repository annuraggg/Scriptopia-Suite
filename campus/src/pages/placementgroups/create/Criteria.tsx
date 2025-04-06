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
} from "lucide-react";
import { PlacementGroupRule } from "@shared-types/Drive";
import { useOutletContext } from "react-router-dom";
import { RootContext } from "@/types/RootContext";
import { Department } from "@shared-types/Institute";

// Data definitions at the top
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

// Generate graduation year options (previous 10 years and next 5 years)
const generateGraduationYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  // Previous 10 years
  for (let i = 10; i > 0; i--) {
    const year = currentYear - i;
    years.push({ value: year.toString(), label: year.toString() });
  }

  // Current year
  years.push({ value: currentYear.toString(), label: currentYear.toString() });

  // Next 5 years
  for (let i = 1; i <= 5; i++) {
    const year = currentYear + i;
    years.push({ value: year.toString(), label: year.toString() });
  }

  return years;
};

const GRADUATION_YEARS = generateGraduationYears();

// Category definitions
const CATEGORY_OPTIONS = [
  { value: "basic", label: "Basic Information" },
  { value: "education", label: "Education" },
  { value: "work", label: "Work Experience" },
  { value: "projects", label: "Projects" },
  { value: "achievements", label: "Achievements" },
];

// Subcategory options by category
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

  // New state for editing
  const [editingRule, setEditingRule] = useState<PlacementGroupRule | null>(
    null
  );
  const [ruleFormData, setRuleFormData] = useState({
    category: "",
    subcategory: "",
    operator: "",
    value: "",
    type: "",
  });

  // Add a new rule
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
  };

  // Update an existing rule
  const updateRule = () => {
    if (!editingRule?._id) return;

    const updatedRules = rules.map((rule) =>
      rule._id === editingRule._id
        ? {
            ...rule,
            category: ruleFormData.category,
            subcategory: ruleFormData.subcategory,
            operator: ruleFormData.operator,
            value: ruleFormData.value,
            type: ruleFormData.type || undefined,
          }
        : rule
    );

    setRules(updatedRules);
    setEditingRule(null);
    onClose();
  };

  // Delete a rule
  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule._id !== ruleId));
  };

  // Open the modal for editing a rule
  const editRule = (rule: PlacementGroupRule) => {
    setEditingRule(rule);
    setRuleFormData({
      category: rule.category,
      subcategory: rule.subcategory,
      operator: rule.operator,
      value: rule.value,
      type: rule.type || "",
    });
    onOpen();
  };

  // Get operator options based on subcategory
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

  const renderRuleModal = () => {
    // Use either editing data or initialize new values
    const isEditing = !!editingRule;

    const [category, setCategory] = useState(
      isEditing ? ruleFormData.category : "basic"
    );
    const [subcategory, setSubcategory] = useState(
      isEditing ? ruleFormData.subcategory : ""
    );
    const [operator, setOperator] = useState(
      isEditing ? ruleFormData.operator : ">="
    );
    const [value, setValue] = useState(isEditing ? ruleFormData.value : "");
    const [educationType, setEducationType] = useState(
      isEditing ? ruleFormData.type : ""
    );

    // Initialize with edited values when editing
    useEffect(() => {
      if (isEditing) {
        setCategory(ruleFormData.category);
        setSubcategory(ruleFormData.subcategory);
        setOperator(ruleFormData.operator);
        setValue(ruleFormData.value);
        setEducationType(ruleFormData.type);
      }
    }, [isEditing, ruleFormData]);

    // Update operator when subcategory changes
    useEffect(() => {
      if (subcategory) {
        if (
          subcategory === "gender" ||
          subcategory === "degree" ||
          subcategory === "experienceType"
        ) {
          setOperator("=");
        } else if (subcategory === "branch" || subcategory === "location") {
          setOperator("contains");
        } else if (subcategory === "gaps") {
          setOperator("<=");
        } else {
          setOperator(">=");
        }
      }
    }, [subcategory]);

    // Live preview of the rule being created/edited
    const criteriaPreview = useMemo(() => {
      if (!category || !subcategory || !operator || !value) return "";

      const getSubcategoryLabel = () => {
        return (
          SUBCATEGORY_OPTIONS[category]?.find(
            (opt) => opt.value === subcategory
          )?.label || subcategory
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
        return operatorMap[operator] || operator;
      };

      const getEducationTypeLabel = () => {
        if (!educationType) return "";
        return (
          EDUCATION_TYPES.find((opt) => opt.value === educationType)?.label ||
          ""
        );
      };

      // Handle special cases for specific fields
      if (subcategory === "gender") {
        const genderLabel =
          GENDER_OPTIONS.find((g) => g.value === value)?.label || value;
        return `Candidate should be ${genderLabel}`;
      } else if (subcategory === "degree") {
        const degreeLabel =
          DEGREE_TYPES.find((d) => d.value === value)?.label || value;
        return `Candidate should have degree type ${
          operator === "=" ? "equal to" : "not equal to"
        } ${degreeLabel}`;
      } else if (subcategory === "experienceType") {
        const expTypeLabel =
          EXPERIENCE_TYPES.find((e) => e.value === value)?.label || value;
        return `Candidate should have experience type ${
          operator === "=" ? "equal to" : "not equal to"
        } ${expTypeLabel}`;
      } else if (subcategory === "graduationYear") {
        return `Candidate should have graduation year ${getOperatorText()} ${value}`;
      }

      const educationTypeText = educationType
        ? `${getEducationTypeLabel()} `
        : "";

      return `Candidate should have ${
        subcategory === "percentage" ? educationTypeText : ""
      }${getSubcategoryLabel()} ${getOperatorText()} ${value}`;
    }, [category, subcategory, operator, value, educationType]);

    // Render value input based on subcategory
    const renderValueInput = () => {
      if (subcategory === "gender") {
        return (
          <Select
            label="Gender"
            placeholder="Select gender"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            classNames={{
              label: "text-sm font-medium",
            }}
            variant="bordered"
            selectedKeys={value ? [value] : []}
          >
            {GENDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
      } else if (subcategory === "degree") {
        return (
          <Select
            label="Degree Type"
            placeholder="Select degree type"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            classNames={{
              label: "text-sm font-medium",
            }}
            variant="bordered"
            selectedKeys={value ? [value] : []}
          >
            {DEGREE_TYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
      } else if (subcategory === "branch") {
        return (
          <Select
            label="Branch/Department"
            placeholder="Select department"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            classNames={{
              label: "text-sm font-medium",
            }}
            variant="bordered"
            selectedKeys={value ? [value] : []}
          >
            {institute.departments?.map((department: Department) => (
              <SelectItem key={department._id} value={department.name}>
                {department.name}
              </SelectItem>
            ))}
          </Select>
        );
      } else if (subcategory === "experienceType") {
        return (
          <Select
            label="Experience Type"
            placeholder="Select experience type"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            classNames={{
              label: "text-sm font-medium",
            }}
            variant="bordered"
            selectedKeys={value ? [value] : []}
          >
            {EXPERIENCE_TYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
      } else if (subcategory === "graduationYear") {
        return (
          <Select
            label="Graduation Year"
            placeholder="Select graduation year"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            classNames={{
              label: "text-sm font-medium",
            }}
            variant="bordered"
            selectedKeys={value ? [value] : []}
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type={
              subcategory === "percentage" ||
              subcategory === "age" ||
              subcategory === "experience" ||
              subcategory === "projectCount" ||
              subcategory === "gaps" ||
              subcategory === "activeBacklogs" ||
              subcategory === "totalBacklogs" ||
              subcategory === "certificateCount" ||
              subcategory === "awardCount" ||
              subcategory === "scholarshipCount" ||
              subcategory === "patentCount"
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

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setEditingRule(null);
        }}
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
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory("");
                  setOperator(">=");
                  setValue("");
                  setEducationType("");
                }}
                classNames={{
                  label: "text-sm font-medium",
                }}
                variant="bordered"
                selectedKeys={[category]}
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
                value={subcategory}
                onChange={(e) => {
                  setSubcategory(e.target.value);
                  setValue("");

                  // Set default operator based on subcategory
                  if (
                    e.target.value === "branch" ||
                    e.target.value === "location"
                  ) {
                    setOperator("contains");
                  } else if (
                    e.target.value === "gender" ||
                    e.target.value === "degree" ||
                    e.target.value === "experienceType"
                  ) {
                    setOperator("=");
                  } else if (e.target.value === "gaps") {
                    setOperator("<=");
                  } else {
                    setOperator(">=");
                  }
                }}
                isDisabled={!category}
                classNames={{
                  label: "text-sm font-medium",
                }}
                variant="bordered"
                selectedKeys={subcategory ? [subcategory] : []}
              >
                {category
                  ? SUBCATEGORY_OPTIONS[category]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  : null}
              </Select>

              {subcategory === "percentage" && (
                <Select
                  label="Education Type"
                  placeholder="Select education type"
                  value={educationType}
                  onChange={(e) => setEducationType(e.target.value)}
                  classNames={{
                    label: "text-sm font-medium",
                  }}
                  variant="bordered"
                  selectedKeys={educationType ? [educationType] : []}
                >
                  {EDUCATION_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              )}

              {subcategory && (
                <Select
                  label="Operator"
                  placeholder="Select an operator"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  classNames={{
                    label: "text-sm font-medium",
                  }}
                  variant="bordered"
                  selectedKeys={[operator]}
                >
                  {getOperatorOptions(subcategory).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              )}

              {subcategory && renderValueInput()}

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
            <Button
              color="danger"
              variant="flat"
              onPress={() => {
                onClose();
                setEditingRule(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => {
                if (category && subcategory && operator && value) {
                  if (isEditing) {
                    // Update existing rule
                    updateRule();
                  } else {
                    // Add new rule
                    addRule(
                      category,
                      subcategory,
                      operator,
                      value,
                      educationType || undefined
                    );
                  }
                }
              }}
              startContent={isEditing ? <Save size={18} /> : <Plus size={18} />}
              isDisabled={!category || !subcategory || !operator || !value}
            >
              {isEditing ? "Update Criteria" : "Add Criteria"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Helper function to get readable rule summary
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

    // Handle special cases for display
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

  // Get a human-readable sentence version of the rule
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

    // Get subcategory in a readable format
    let subcategoryLabel =
      rule.subcategory.charAt(0).toUpperCase() +
      rule.subcategory.slice(1).replace(/([A-Z])/g, " $1");

    // Add education type prefix if applicable
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

    // Handle special cases for human-readable display
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
            onClose={() => deleteRule(rule._id || "")}
            variant="flat"
            color={getCategoryColor(rule.category)}
            className="py-2 px-3"
            startContent={
              <div className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
            }
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => editRule(rule)}
                className="ml-1 -mr-1"
              >
                <Edit2 size={14} />
              </Button>
            }
          >
            {getRuleSummary(rule)}
          </Chip>
        ))}
      </div>
    );
  };

  // Helper function to get color based on category
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

  // Simple component to show when there are no criteria
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
          onPress={onOpen}
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
              onPress={onOpen}
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
