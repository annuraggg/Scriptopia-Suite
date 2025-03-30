import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import CompanyDetailsTab from "./CompanyDetailsTab";
import CompanyHRTab from "./CompanyHRTab";
import CompanyStatsTab from "./CompanyStatsTab";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CreateCompanyFormProps {
  onClose: () => void;
}

const CreateCompanyForm: React.FC<CreateCompanyFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [rolesOffered, setRolesOffered] = useState<string[]>([]);

  const [hrName, setHrName] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [hrPhone, setHrPhone] = useState("");
  const [hrWebsite, setHrWebsite] = useState("");

  const [avgPackage, setAvgPackage] = useState("");
  const [highestPackage, setHighestPackage] = useState("");
  const [studentsHired, setStudentsHired] = useState("");
  const [yearVisit, setYearVisit] = useState<string[]>([new Date().getFullYear().toString()]);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!name) {
        toast.error("Company name is required");
        setLoading(false);
        return;
      }

      if (!studentsHired || !avgPackage || !highestPackage) {
        toast.error("All placement statistics are required");
        setLoading(false);
        return;
      }

      const companyData = {
        name,
        description,
        hrContacts: {
          name: hrName,
          email: hrEmail,
          phone: hrPhone,
          website: hrWebsite || ""
        },
        generalInfo: {
          industry: industry,
          yearVisit: yearVisit,
          studentsHired: Number(studentsHired),
          averagePackage: Number(avgPackage),
          highestPackage: Number(highestPackage),
          rolesOffered: rolesOffered
        }
      };

      const response = await axios.post("/companies/create", companyData);

      toast.success("Company profile created successfully!");
      
      onClose();
      
      window.location.href = "/companyprofiles";
    } catch (err: any) {
      console.error("Error creating company:", err);
      toast.error(err.response?.data?.message || "Error creating company profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-5 h-full py-8">
      <div className="flex flex-col space-y-4 px-4 w-[30%]">
        {[
          { id: 1, title: "Company Details" },
          { id: 2, title: "HR Contacts" },
          { id: 3, title: "Placement Stats" },
        ].map((step, index) => (
          <div
            key={step.id}
            className={`
              flex items-center justify-between 
              px-4 py-3 
              rounded-lg 
              transition-all duration-300 ease-in-out 
              ${activeStep === index
                ? "bg-foreground text-background"
                : "bg-background text-foreground"
              }
              cursor-pointer group
            `}
            onClick={() => {
              if (
                index === activeStep - 1 ||
                index === activeStep + 1 ||
                index === activeStep
              ) {
                setActiveStep(index);
              }
            }}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`
                  w-10 h-1 
                  rounded-full 
                  transition-all duration-300 
                  ${activeStep === index ? "bg-background" : "bg-foreground"}
                `}
              ></div>
              <span className={`font-medium text-sm w-full`}>{step.title}</span>
            </div>
            <ChevronRight
              className={`
                text-white 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-300
                ${activeStep === index ? "opacity-100" : ""}
              `}
              size={20}
            />
          </div>
        ))}
      </div>

      <div className="w-full overflow-y-auto h-full">
        {activeStep === 0 && (
          <CompanyDetailsTab
            name={name}
            setName={setName}
            industry={industry}
            setIndustry={setIndustry}
            description={description}
            setDescription={setDescription}
            rolesOffered={rolesOffered}
            setRolesOffered={setRolesOffered}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 1 && (
          <CompanyHRTab
            hrName={hrName}
            setHrName={setHrName}
            hrEmail={hrEmail}
            setHrEmail={setHrEmail}
            hrPhone={hrPhone}
            setHrPhone={setHrPhone}
            hrWebsite={hrWebsite}
            setHrWebsite={setHrWebsite}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 2 && (
          <CompanyStatsTab
            avgPackage={avgPackage}
            setAvgPackage={setAvgPackage}
            highestPackage={highestPackage}
            setHighestPackage={setHighestPackage}
            studentsHired={studentsHired}
            setStudentsHired={setStudentsHired}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            onSave={handleSave}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCompanyForm;