import { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Select,
  SelectItem,
  CardBody,
  Textarea,
  Chip,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

interface CreateCompanyFormProps {
  onClose: () => void;
}

interface CompanyFormData {
  name: string;
  description: string;
  generalInfo: {
    industry: string[];
    yearVisit: string[];
    studentsHired: number;
    averagePackage: number;
    highestPackage: number;
    rolesOffered: string[];
  };
  hrContacts: {
    name: string;
    phone: string;
    email: string;
    website: string;
  };
}

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Education",
  "Consulting",
  "Other"
];

const roles = [
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
  "Marketing Specialist",
  "Business Analyst",
  "HR Manager",
  "Sales Executive",
  "Other"
];

const CreateCompanyForm = ({ onClose }: CreateCompanyFormProps) => {
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    description: "",
    generalInfo: {
      industry: [],
      yearVisit: [],
      studentsHired: 0,
      averagePackage: 0,
      highestPackage: 0,
      rolesOffered: []
    },
    hrContacts: {
      name: "",
      phone: "",
      email: "",
      website: "https://"
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("/companies/create", formData);
      toast.success("Company created successfully!");
      onClose();
    } catch (err) {
      console.error("Error creating company:", err);
      toast.error("Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        industry: prev.generalInfo.industry.includes(industry)
          ? prev.generalInfo.industry.filter(i => i !== industry)
          : [...prev.generalInfo.industry, industry]
      }
    }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        rolesOffered: prev.generalInfo.rolesOffered.includes(role)
          ? prev.generalInfo.rolesOffered.filter(r => r !== role)
          : [...prev.generalInfo.rolesOffered, role]
      }
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-screen flex flex-col">
      <div className="sticky top-0 bg-background z-10 p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent">
            Create a New Company Profile
          </h1>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-400">
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep >= 1
                    ? "bg-green-600 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                1
              </span>
              <span className="font-medium">Company Information</span>
              <span className="mx-4 h-px w-16 bg-gradient-to-r from-green-500 to-gray-700" />
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep >= 2 ? "bg-green-500 text-white" : "bg-gray-700"
                }`}
              >
                2
              </span>
              <span className="font-medium">Placement Details</span>
              <span className="mx-4 h-px w-16 bg-gradient-to-r from-green-500 to-gray-700" />
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep >= 3 ? "bg-green-500 text-white" : "bg-gray-700"
                }`}
              >
                3
              </span>
              <span className="font-medium">Contact Information</span>
            </div>
            <span className="text-xl font-bold text-green-500">
              {currentStep}/3
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {currentStep === 1 && (
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardBody className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter company name"
                  className="shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the company"
                  minRows={3}
                  className="shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Chip
                      key={industry}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.generalInfo.industry.includes(industry)
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                      onClick={() => handleIndustryToggle(industry)}
                    >
                      {industry}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  color="danger"
                  variant="light"
                  onClick={onClose}
                  className="hover:bg-red-50"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onClick={() => setCurrentStep(2)}
                  className=""
                  isDisabled={
                    !formData.name ||
                    !formData.description ||
                    formData.generalInfo.industry.length === 0
                  }
                >
                  Next
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardBody className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Students Hired
                </label>
                <Input
                  type="number"
                  value={formData.generalInfo.studentsHired.toString()}
                  onChange={(e) => setFormData({
                    ...formData,
                    generalInfo: {
                      ...formData.generalInfo,
                      studentsHired: Number(e.target.value)
                    }
                  })}
                  placeholder="Number of students hired"
                  className="shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Average Package (₹)
                  </label>
                  <Input
                    type="number"
                    value={formData.generalInfo.averagePackage.toString()}
                    onChange={(e) => setFormData({
                      ...formData,
                      generalInfo: {
                        ...formData.generalInfo,
                        averagePackage: Number(e.target.value)
                      }
                    })}
                    placeholder="Average package offered"
                    className="shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Highest Package (₹)
                  </label>
                  <Input
                    type="number"
                    value={formData.generalInfo.highestPackage.toString()}
                    onChange={(e) => setFormData({
                      ...formData,
                      generalInfo: {
                        ...formData.generalInfo,
                        highestPackage: Number(e.target.value)
                      }
                    })}
                    placeholder="Highest package offered"
                    className="shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Roles Offered
                </label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Chip
                      key={role}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.generalInfo.rolesOffered.includes(role)
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                      onClick={() => handleRoleToggle(role)}
                    >
                      {role}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => setCurrentStep(1)}
                  className="hover:bg-red-50"
                >
                  Back
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onClick={() => setCurrentStep(3)}
                  className=""
                  isDisabled={
                    formData.generalInfo.studentsHired <= 0 ||
                    formData.generalInfo.averagePackage <= 0 ||
                    formData.generalInfo.highestPackage <= 0 ||
                    formData.generalInfo.rolesOffered.length === 0
                  }
                >
                  Next
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardBody className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium mb-2">
                  HR Contact Name
                </label>
                <Input
                  value={formData.hrContacts.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    hrContacts: {
                      ...formData.hrContacts,
                      name: e.target.value
                    }
                  })}
                  placeholder="Name of HR contact person"
                  className="shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.hrContacts.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      hrContacts: {
                        ...formData.hrContacts,
                        email: e.target.value
                      }
                    })}
                    placeholder="Email address"
                    className="shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.hrContacts.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      hrContacts: {
                        ...formData.hrContacts,
                        phone: e.target.value
                      }
                    })}
                    placeholder="Phone number"
                    className="shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Website
                </label>
                <Input
                  type="url"
                  value={formData.hrContacts.website}
                  onChange={(e) => setFormData({
                    ...formData,
                    hrContacts: {
                      ...formData.hrContacts,
                      website: e.target.value
                    }
                  })}
                  placeholder="Company website URL"
                  className="shadow-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => setCurrentStep(2)}
                  className="hover:bg-red-50"
                >
                  Back
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onClick={handleSubmit}
                  isLoading={loading}
                  isDisabled={
                    !formData.hrContacts.name ||
                    !formData.hrContacts.email ||
                    !formData.hrContacts.phone ||
                    !formData.hrContacts.website
                  }
                >
                  Create Company
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateCompanyForm;