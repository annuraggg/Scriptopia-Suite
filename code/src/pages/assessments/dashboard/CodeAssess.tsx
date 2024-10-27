import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { Eye, Link, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Assessment } from "@shared-types/Assessment";
import { toast } from "sonner";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";

const calculateStatus = (createdAssessment: Assessment) => {
  const startDate = new Date(createdAssessment?.openRange?.start || "");
  const endDate = new Date(createdAssessment?.openRange?.end || "");
  const currentDate = new Date();

  if (currentDate < startDate) return "Upcoming";
  if (currentDate > endDate) return "Expired";
  return "Active";
};

const copyLink = (assessmentId: string) => {
  navigator.clipboard.writeText(
    `${window.location.origin}/assessments/${assessmentId}`
  );
  toast.success("Link copied to clipboard");
};


const CodeAssess = ({ createdAssessments: initialCreatedAssessments }: { createdAssessments: Assessment[] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [createdAssessments, setCreatedAssessments] = useState<Assessment[]>(initialCreatedAssessments);


  const filteredAssessments = useMemo(() => {
    return createdAssessments.filter((assessment) =>
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [createdAssessments, searchTerm]);


  const { getToken } = useAuth();
  const axios = ax(getToken);


  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/assessments/code/created/${id}`);
      toast.success("Assessment deleted successfully");


      setCreatedAssessments(prevAssessments =>
        prevAssessments.filter(assessment => assessment._id !== id)
      );
    } catch (error) {
      toast.error("Failed to delete assessment");
      console.error("Error deleting assessment:", (error as any).response?.data || (error as any).message || error);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-10 h-[90vh]"
    >
      <div>
        <div>
          <Input
            placeholder="Search Code Assessments"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Button
            className="mt-5"
            variant="flat"
            onClick={() => navigate("/assessments/new/code")}
          >
            + Create Code Assessment
          </Button>
        </div>
        <div className="mt-5 flex gap-5 flex-wrap">
          {filteredAssessments.map((CreatedAssessment) => (
            <Card key={CreatedAssessment._id} className="w-[32%]">
              <CardHeader>{CreatedAssessment.name}</CardHeader>
              <CardBody>
                <p className="text-xs text-gray-500">
                  Status:{" "}
                  <span
                    className={`${calculateStatus(CreatedAssessment) === "Active"
                      ? "text-green-500"
                      : calculateStatus(CreatedAssessment) === "Upcoming"
                        ? "text-yellow-500"
                        : "text-red-500"
                      }`}
                  >
                    {calculateStatus(CreatedAssessment)}
                  </span>
                </p>
                <p>
                  <span className="text-xs text-gray-500">Date: </span>
                  <span className="text-xs text-white-200">
                    {new Date(CreatedAssessment.createdAt).toLocaleString()}
                  </span>
                </p>
                <p>
                  <span className="text-xs text-gray-500">Duration: </span>
                  <span className="text-xs text-white-200">
                    {CreatedAssessment.timeLimit} minutes
                  </span>
                </p>
                <p>
                  <span className="text-xs text-gray-500">Codes: </span>
                  <span className="text-xs text-white-200">
                    {CreatedAssessment.problems.length}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-2">Time Range:</p>
                <p className="text-xs text-white-200">
                  {new Date(CreatedAssessment?.openRange?.start || "").toLocaleString()}{" "}
                  <span className="text-xs text-gray-500 mt-2">to </span>
                  {new Date(CreatedAssessment?.openRange?.end || "").toLocaleString()}
                </p>
              </CardBody>
              <CardFooter className="gap-2 flex-wrap">
                <Button
                  className="w-[48%] flex items-center justify-center text-xs gap-3"
                  variant="flat"
                  onClick={() => navigate(`/assessments/${CreatedAssessment._id}/view`)}
                >
                  <Eye size={18} /> <p>View</p>
                </Button>
                <Button
                  className="w-[48%] flex items-center justify-center text-xs gap-3 bg-red-900 bg-opacity-40"
                  variant="flat"
                  onClick={() => handleDelete(CreatedAssessment._id)}
                >
                  <Trash2 size={18} /> <p>Delete</p>
                </Button>
                <Button
                  className="w-full flex items-center justify-center text-xs gap-3"
                  variant="flat"
                  onClick={() => copyLink(CreatedAssessment._id)}
                >
                  <Link size={18} /> <p>Copy Link</p>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CodeAssess;
