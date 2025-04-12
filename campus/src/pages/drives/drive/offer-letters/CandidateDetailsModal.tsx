import React, { useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Chip,
  Divider,
} from "@nextui-org/react";
import { Mail, Phone, Calendar, User } from "lucide-react";
import { ExtendedCandidate } from "@shared-types/ExtendedCandidate";

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: ExtendedCandidate | null;
  onViewFullProfile: (candidateId: string) => void;
}

const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onViewFullProfile,
}) => {
  // Use memoization for derived data
  const latestEducation = useMemo(() => {
    if (!candidate?.education || candidate.education.length === 0) return null;
    return candidate.education.sort(
      (a, b) => (b.endYear || 9999) - (a.endYear || 9999)
    )[0];
  }, [candidate?.education]);

  const latestWorkExperience = useMemo(() => {
    if (!candidate?.workExperience || candidate.workExperience.length === 0)
      return null;
    return candidate.workExperience.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0];
  }, [candidate?.workExperience]);

  // Safely format date if provided
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Invalid date format:", error);
      return "Invalid Date";
    }
  };

  // Handle case where no candidate is provided
  if (!candidate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Candidate Profile</h3>
              </div>
            </ModalHeader>
            <Divider />
            <ModalBody className="py-5">
              <div className="flex items-center gap-4 mb-6">
                <Avatar
                  src={candidate.profileImage}
                  showFallback
                  name={candidate.name || "User"}
                  className="h-16 w-16"
                />
                <div>
                  <h4 className="text-xl font-semibold">
                    {candidate.name || "No name provided"}
                  </h4>
                  <p className="text-default-500">
                    {candidate.email || "No email provided"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-default-700 mb-2">
                    Contact Information
                  </h5>
                  <div className="bg-default-50 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-default-500" />
                      <span>{candidate.email || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-default-500" />
                      <span>{candidate.phone || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-default-500" />
                      <span>DOB: {formatDate(candidate.dob?.toString())}</span>
                    </div>
                  </div>
                </div>

                {/* Education */}
                {latestEducation ? (
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-default-700 mb-2">
                      Education
                    </h5>
                    <div className="bg-default-50 rounded-md p-3">
                      <div className="font-medium">
                        {latestEducation.degree} in{" "}
                        {latestEducation.branch || "N/A"}
                      </div>
                      <div className="text-sm text-default-600 mt-1">
                        {latestEducation.school || "N/A"},{" "}
                        {latestEducation.board || "N/A"}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Chip size="sm" color="primary" variant="flat">
                          {latestEducation.percentage || "N/A"}%
                        </Chip>
                        <span className="text-xs text-default-500">
                          {latestEducation.startYear || "?"} -{" "}
                          {latestEducation.current
                            ? "Present"
                            : latestEducation.endYear || "?"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-default-700 mb-2">
                      Education
                    </h5>
                    <div className="bg-default-50 rounded-md p-3 text-default-500">
                      No education information provided
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {/* Work Experience */}
                {latestWorkExperience ? (
                  <div className="mb-5">
                    <h5 className="text-sm font-semibold text-default-700 mb-2">
                      Work Experience
                    </h5>
                    <div className="bg-default-50 rounded-md p-3">
                      <div className="font-medium">
                        {latestWorkExperience.title || "Position not specified"}
                      </div>
                      <div className="text-sm text-default-600 mt-1">
                        {latestWorkExperience.company ||
                          "Company not specified"}
                        ,{" "}
                        {latestWorkExperience.location ||
                          "Location not specified"}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Chip size="sm" variant="flat">
                          {latestWorkExperience.type || "Type not specified"}
                        </Chip>
                        <span className="text-xs text-default-500">
                          {formatDate(latestWorkExperience.startDate?.toString())} -{" "}
                          {latestWorkExperience.current
                            ? "Present"
                            : formatDate(latestWorkExperience.endDate?.toString())}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-5">
                    <h5 className="text-sm font-semibold text-default-700 mb-2">
                      Work Experience
                    </h5>
                    <div className="bg-default-50 rounded-md p-3 text-default-500">
                      No work experience information provided
                    </div>
                  </div>
                )}

                {/* Skills */}
                {candidate.technicalSkills &&
                candidate.technicalSkills.length > 0 ? (
                  <div className="mb-0">
                    <h5 className="text-sm font-semibold text-default-700 mb-2">
                      Technical Skills
                    </h5>
                    <div className="bg-default-50 rounded-md p-3">
                      <div className="flex flex-wrap gap-1">
                        {candidate.technicalSkills.map((skill) => (
                          <Chip
                            key={skill._id || skill.skill}
                            variant="flat"
                            size="sm"
                            color={
                              skill.proficiency > 3 ? "primary" : "default"
                            }
                          >
                            {skill.skill}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-0">
                    <h5 className="text-sm font-semibold text-default-700 mb-2">
                      Technical Skills
                    </h5>
                    <div className="bg-default-50 rounded-md p-3 text-default-500">
                      No technical skills information provided
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <div className="flex justify-between w-full">
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<User className="h-4 w-4" />}
                  onPress={() => {
                    if (candidate._id) {
                      onViewFullProfile(candidate._id);
                    } else {
                      console.error("No candidate ID available");
                    }
                  }}
                  isDisabled={!candidate._id}
                >
                  View Full Profile
                </Button>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CandidateDetailsModal;
