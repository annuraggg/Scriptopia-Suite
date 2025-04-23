import {
  Breadcrumbs,
  BreadcrumbItem,
  Card,
  CardBody,
  CardHeader,
  Button,
  Switch,
  Input,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { Candidate } from "@shared-types/Candidate";
import { useOutletContext, Link } from "react-router-dom";
import ResumePDF from "./ResumePDF";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Download,
  GripVertical,
  CheckCircle,
  AlertTriangle,
  UserCog,
} from "lucide-react";
import axios from "axios";
import { ThemeStyles } from "@/types/ResumeTheme";
import Themes from "./Themes";
import ThemeCustomizer from "./ThemeCustomizer";
import { pdf } from "@react-pdf/renderer";
import { useState, useEffect } from "react";

// ATS Check interface
interface ATSCheckResult {
  score: number;
  suggestions: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
  sectionsAnalysis: {
    [key: string]: {
      strength: string;
      suggestions: string[];
    };
  };
}

// Section interface
interface ResumeSection {
  id: string;
  title: string;
  active: boolean;
  content: any;
}

const Resume: React.FC = () => {
  const { user } = useOutletContext() as { user: Candidate };
  const [theme, setTheme] = useState<ThemeStyles>(
    Themes.getThemeByName("Minimal")
  );

  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: "summary",
      title: "Summary",
      active: true,
      content: user.summary || "",
    },
    {
      id: "education",
      title: "Education",
      active: (user.education && user.education.length > 0) || false,
      content: user.education || [],
    },
    {
      id: "workExperience",
      title: "Work Experience",
      active: (user.workExperience && user.workExperience.length > 0) || false,
      content: user.workExperience || [],
    },
    {
      id: "technicalSkills",
      title: "Technical Skills",
      active:
        (user.technicalSkills && user.technicalSkills.length > 0) || false,
      content: user.technicalSkills || [],
    },
    {
      id: "projects",
      title: "Projects",
      active: (user.projects && user.projects.length > 0) || false,
      content: user.projects || [],
    },
    {
      id: "languages",
      title: "Languages",
      active: (user.languages && user.languages.length > 0) || false,
      content: user.languages || [],
    },
    {
      id: "certificates",
      title: "Certificates",
      active: (user.certificates && user.certificates.length > 0) || false,
      content: user.certificates || [],
    },
    {
      id: "awards",
      title: "Awards",
      active: (user.awards && user.awards.length > 0) || false,
      content: user.awards || [],
    },
  ]);
  const [isATSModalOpen, setIsATSModalOpen] = useState<boolean>(false);
  const [isATSChecking, setIsATSChecking] = useState<boolean>(false);
  const [atsResult, setAtsResult] = useState<ATSCheckResult | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [isProfileEmpty, setIsProfileEmpty] = useState<boolean>(true);

  // Check if all sections are empty
  useEffect(() => {
    const checkIfProfileEmpty = () => {
      // Check if user has any content
      const hasSummary = !!user.summary;
      const hasEducation = user.education && user.education.length > 0;
      const hasWorkExperience =
        user.workExperience && user.workExperience.length > 0;
      const hasTechnicalSkills =
        user.technicalSkills && user.technicalSkills.length > 0;
      const hasProjects = user.projects && user.projects.length > 0;
      const hasLanguages = user.languages && user.languages.length > 0;
      const hasCertificates = user.certificates && user.certificates.length > 0;
      const hasAwards = user.awards && user.awards.length > 0;

      // If all are empty, profile is empty
      setIsProfileEmpty(
        !hasSummary &&
          !hasEducation &&
          !hasWorkExperience &&
          !hasTechnicalSkills &&
          !hasProjects &&
          !hasLanguages &&
          !hasCertificates &&
          !hasAwards
      );
    };

    checkIfProfileEmpty();
  }, [user]);

  // Handle section title change
  const handleSectionTitleChange = (id: string, newTitle: string): void => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, title: newTitle } : section
      )
    );
  };

  // Handle section toggle
  const handleSectionToggle = (id: string): void => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, active: !section.active } : section
      )
    );
  };

  // Handle drag end for section reordering
  const onDragEnd = (result: DropResult): void => {
    // Check if we have a valid destination
    if (!result.destination) return;

    // Also return if the item is dropped in the same position
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }

    // Create a copy of sections to avoid direct state mutation
    const newSections = Array.from(sections);
    // Remove item from original position
    const [reorderedItem] = newSections.splice(result.source.index, 1);
    // Insert item at the new position
    newSections.splice(result.destination.index, 0, reorderedItem);

    // Update state with the new order
    setSections(newSections);
  };

  // Display a formatted date
  const formatDate = (date?: Date | string): string => {
    if (!date) return "Present";
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const handleDownloadPDF = async (): Promise<void> => {
    try {
      // Get active sections
      const activeSectionIds = sections
        .filter((section) => section.active)
        .map((section) => section.id);

      // Create a blob URL for the PDF
      const blob = await pdf(
        <ResumePDF user={user} activeSections={activeSectionIds} />
      ).toBlob();

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${user.name.replace(/\s+/g, "_")}_Resume.pdf`;
      link.click();

      // Clean up the URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  };

  // Render the resume header based on theme layout
  const renderHeader = (): JSX.Element => {
    const headerClasses = `${theme.headerStyle} ${theme.headerAlignment}`;

    switch (theme.layout) {
      case "traditional":
        return (
          <div className={headerClasses}>
            <h1
              className={`text-2xl font-bold ${theme.heading} ${theme.font.heading}`}
            >
              {user.name}
            </h1>
            <div className={`mt-2 ${theme.secondary}`}>
              <p>
                {user.email} | {user.phone}
              </p>
              <p>{user.address}</p>
              {user.socialLinks && user.socialLinks.length > 0 && (
                <div
                  className={`flex ${
                    theme.headerAlignment === "text-center"
                      ? "justify-center"
                      : theme.headerAlignment === "text-right"
                      ? "justify-end"
                      : "justify-start"
                  } gap-4 mt-2`}
                >
                  {user.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${theme.primary} hover:underline`}
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "modern":
        return (
          <div className={`${headerClasses} grid grid-cols-2`}>
            <div>
              <h1
                className={`text-3xl font-bold ${theme.heading} ${theme.font.heading}`}
              >
                {user.name}
              </h1>
              <div className={`mt-1 ${theme.secondary}`}>
                <p>
                  {user.email} | {user.phone}
                </p>
              </div>
            </div>
            <div
              className={
                theme.headerAlignment === "text-center"
                  ? "text-center"
                  : theme.headerAlignment === "text-right"
                  ? "text-right"
                  : "text-left"
              }
            >
              <p className={theme.secondary}>{user.address}</p>
              {user.socialLinks && user.socialLinks.length > 0 && (
                <div
                  className={`flex ${
                    theme.headerAlignment === "text-center"
                      ? "justify-center"
                      : theme.headerAlignment === "text-right"
                      ? "justify-end"
                      : "justify-start"
                  } gap-3 mt-1`}
                >
                  {user.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${theme.primary} hover:underline`}
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className={headerClasses}>
            <h1
              className={`text-3xl font-bold ${theme.heading} ${theme.font.heading}`}
            >
              {user.name}
            </h1>
            <div className={`mt-2 ${theme.secondary}`}>
              <p>
                {user.email} | {user.phone}
              </p>
              <p>{user.address}</p>
              {user.socialLinks && user.socialLinks.length > 0 && (
                <div
                  className={`flex ${
                    theme.headerAlignment === "text-center"
                      ? "justify-center"
                      : theme.headerAlignment === "text-right"
                      ? "justify-end"
                      : "justify-start"
                  } gap-4 mt-2`}
                >
                  {user.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${theme.primary} hover:underline`}
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  // Render section header based on theme
  const renderSectionHeader = (section: ResumeSection): JSX.Element => {
    return (
      <div
        className={`flex items-center gap-2 ${theme.sectionHeadingStyle} ${theme.border} pb-1 mb-3`}
      >
        <h2
          className={`text-lg font-semibold ${theme.heading} ${theme.font.heading}`}
        >
          {section.title}
        </h2>
      </div>
    );
  };

  const generatePlainTextResume = (): string => {
    let plainText = `${user.name}\n`;
    plainText += `${user.email} | ${user.phone}\n`;
    plainText += `${user.address}\n\n`;

    // Add social links
    if (user.socialLinks && user.socialLinks.length > 0) {
      plainText += "LINKS\n";
      user.socialLinks.forEach((link) => {
        plainText += `${link.platform}: ${link.url}\n`;
      });
      plainText += "\n";
    }

    // Add each active section
    sections
      .filter((section) => section.active)
      .forEach((section) => {
        plainText += `${section.title.toUpperCase()}\n`;

        // Summary section
        if (section.id === "summary") {
          plainText += `${section.content}\n\n`;
        }

        // Education section
        else if (section.id === "education" && user.education) {
          user.education.forEach((edu) => {
            plainText += `${edu.school} (${edu.startYear} - ${
              edu.current ? "Present" : edu.endYear
            })\n`;
            plainText += `${edu.degree} in ${edu.branch}\n`;
            plainText += `${edu.type} ${
              edu.percentage ? `• ${edu.percentage}%` : ""
            }\n\n`;
          });
        }

        // Work Experience section
        else if (section.id === "workExperience" && user.workExperience) {
          user.workExperience.forEach((work) => {
            plainText += `${work.title} at ${work.company} (${formatDate(
              work.startDate
            )} - ${work.current ? "Present" : formatDate(work.endDate)})\n`;
            plainText += `${work.location} • ${work.type} • ${work.sector}\n`;
            if (work.description) plainText += `${work.description}\n`;
            plainText += "\n";
          });
        }

        // Technical Skills section
        else if (section.id === "technicalSkills" && user.technicalSkills) {
          plainText +=
            user.technicalSkills.map((skill) => skill.skill).join(", ") +
            "\n\n";
        }

        // Projects section
        else if (section.id === "projects" && user.projects) {
          user.projects.forEach((project) => {
            plainText += `${project.title} (${formatDate(
              project.startDate
            )} - ${
              project.current ? "Present" : formatDate(project.endDate)
            })\n`;
            plainText += `${project.domain} • ${project.associatedWith}\n`;
            plainText += `${project.description}\n`;
            if (project.url) plainText += `URL: ${project.url}\n`;
            plainText += "\n";
          });
        }

        // Languages section
        else if (section.id === "languages" && user.languages) {
          plainText +=
            user.languages.map((lang) => lang.language).join(", ") + "\n\n";
        }

        // Certificates section
        else if (section.id === "certificates" && user.certificates) {
          user.certificates.forEach((cert) => {
            plainText += `${cert.title} - ${cert.issuer} (${formatDate(
              cert.issueDate
            )}${
              cert.doesExpire && cert.expiryDate
                ? ` - ${formatDate(cert.expiryDate)}`
                : ""
            })\n`;
            if (cert.hasScore && cert.score)
              plainText += `Score: ${cert.score}\n`;
            if (cert.description) plainText += `${cert.description}\n`;
            plainText += "\n";
          });
        }

        // Awards section
        else if (section.id === "awards" && user.awards) {
          user.awards.forEach((award) => {
            plainText += `${award.title} - ${award.issuer} (${formatDate(
              award.date
            )})\n`;
            plainText += `${award.associatedWith}\n`;
            if (award.description) plainText += `${award.description}\n`;
            plainText += "\n";
          });
        }
      });

    return plainText;
  };

  // Run ATS compatibility check
  const runATSCheck = async () => {
    try {
      setIsATSChecking(true);
      const plainTextResume = generatePlainTextResume();

      const response = await axios.post("/ats/llm", {
        resume: plainTextResume,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
      });

      if (response.data && response.data.data) {
        setAtsResult(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("ATS Check Error:", error);
      // Set a fallback error result
      setAtsResult({
        score: 0,
        suggestions: ["Unable to complete ATS check. Please try again later."],
        keywords: { found: [], missing: [] },
        sectionsAnalysis: {},
      });
    } finally {
      setIsATSChecking(false);
    }
  };

  // Render ATS check modal
  const renderATSModal = () => {
    return (
      <Modal
        isOpen={isATSModalOpen}
        onOpenChange={(open) => {
          setIsATSModalOpen(open);
          if (!open) {
            setAtsResult(null);
            setJobDescription("");
            setJobTitle("");
          }
        }}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ATS Compatibility Check
              </ModalHeader>
              <ModalBody>
                {!atsResult ? (
                  <>
                    <p className="text-sm mb-4">
                      Improve your resume's chances of passing through Applicant
                      Tracking Systems (ATS). For best results, paste a job
                      description you're applying for.
                    </p>

                    <Input
                      label="Job Title"
                      placeholder="Enter the job title you're applying for"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="mb-3"
                    />

                    <Input
                      label="Job Description"
                      placeholder="Paste the job description here"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-2xl font-bold">
                          {atsResult.score}/10
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          ATS Compatibility Score
                        </h3>
                        <p className="text-sm text-gray-500">
                          {atsResult.score >= 8
                            ? "Great! Your resume is well-optimized for ATS systems."
                            : atsResult.score >= 6
                            ? "Good. Your resume should pass most ATS systems with some improvements."
                            : "Needs work. Make the suggested changes to improve your chances."}
                        </p>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <h3 className="text-md font-semibold mb-2">
                        Key Improvements
                      </h3>
                      <ul className="space-y-2">
                        {atsResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle
                              size={16}
                              className="text-amber-500 mt-1"
                            />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Divider />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-md font-semibold mb-2">
                          Keywords Found
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {atsResult.keywords.found.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                          {atsResult.keywords.found.length === 0 && (
                            <p className="text-sm text-gray-500">
                              No matching keywords found
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-semibold mb-2">
                          Missing Keywords
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {atsResult.keywords.missing.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                          {atsResult.keywords.missing.length === 0 && (
                            <p className="text-sm text-gray-500">
                              Great! You've included all important keywords
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {Object.keys(atsResult.sectionsAnalysis).length > 0 && (
                      <>
                        <Divider />

                        <div>
                          <h3 className="text-md font-semibold mb-2">
                            Section Analysis
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(atsResult.sectionsAnalysis).map(
                              ([section, analysis], index) => (
                                <div
                                  key={index}
                                  className="border rounded-lg p-3"
                                >
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">{section}</h4>
                                    <span
                                      className={`text-sm ${
                                        analysis.strength === "Strong"
                                          ? "text-green-600"
                                          : analysis.strength === "Moderate"
                                          ? "text-amber-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {analysis.strength}
                                    </span>
                                  </div>
                                  {analysis.suggestions.length > 0 && (
                                    <ul className="text-sm mt-2 pl-5 list-disc">
                                      {analysis.suggestions.map(
                                        (suggestion, i) => (
                                          <li key={i}>{suggestion}</li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {!atsResult ? (
                  <>
                    <Button onPress={onClose} color="danger" variant="light">
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={runATSCheck}
                      isDisabled={isATSChecking}
                      startContent={
                        isATSChecking ? (
                          <Spinner size="sm" />
                        ) : (
                          <CheckCircle size={18} />
                        )
                      }
                    >
                      {isATSChecking ? "Analyzing..." : "Run ATS Check"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onPress={onClose} color="primary">
                      Close
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  // Update the top button area to include ATS check button
  const renderTopButtons = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/resume">Resume</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex gap-2">
          <Button
            color="primary"
            variant="solid"
            startContent={<Download size={18} />}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
        </div>
      </div>
    );
  };

  const renderBuilderContent = () => {
    return (
      <Tabs aria-label="Resume Options">
        <Tab key="sections" title="Sections">
          <div className="p-2">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {sections.map((section, index) => {
                      const hasContent = Array.isArray(section.content)
                        ? section.content.length > 0
                        : Boolean(section.content);

                      return (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                          isDragDisabled={!section.active}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${
                                !section.active ? "opacity-70" : ""
                              } ${snapshot.isDragging ? "shadow-lg" : ""}`}
                            >
                              <CardBody className="py-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab"
                                    >
                                      <GripVertical
                                        size={18}
                                        className="text-gray-400"
                                      />
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) =>
                                          handleSectionTitleChange(
                                            section.id,
                                            e.target.value
                                          )
                                        }
                                        isDisabled={!section.active}
                                        variant="underlined"
                                        size="sm"
                                        className="w-auto"
                                      />
                                    </div>
                                  </div>
                                  <Switch
                                    isSelected={section.active}
                                    onValueChange={() =>
                                      hasContent &&
                                      handleSectionToggle(section.id)
                                    }
                                    isDisabled={!hasContent}
                                    size="sm"
                                  />
                                </div>
                                {!hasContent && (
                                  <p className="text-xs text-gray-500 mt-1 ml-8">
                                    No content available
                                  </p>
                                )}
                              </CardBody>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </Tab>
        <Tab key="theming" title="Theme" className="hidden">
          <div className="p-2">
            <ThemeCustomizer
              initialTheme="professional"
              onThemeChange={setTheme}
            />
          </div>
        </Tab>
      </Tabs>
    );
  };

  // If profile is empty, show message to update profile
  if (isProfileEmpty) {
    return (
      <div className="p-5">
        <Card className="w-full">
          <CardBody className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <UserCog size={64} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">
                Your profile is empty
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                To create your resume, please first update your profile with
                relevant information such as education, work experience, skills,
                and projects.
              </p>
              <Button
                as={Link}
                to="/profile"
                color="primary"
                size="lg"
                className="font-medium"
              >
                Complete Your Profile
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-5">
      {renderTopButtons()}

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-110px)]">
        {/* Builder Section (Left Column) - Fixed height */}
        <Card className="w-full md:w-1/3 h-full">
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Resume Builder</h2>
            </div>
          </CardHeader>
          <CardBody className="overflow-y-auto">
            {renderBuilderContent()}
          </CardBody>
        </Card>

        {/* Preview Section (Right Column) - Scrollable */}
        <Card className="w-full md:w-2/3 h-full overflow-hidden resume-container">
          <CardBody
            id="resume-preview"
            className={`p-6 ${theme.background} h-full overflow-y-auto`}
          >
            {/* Resume Header - Rendered based on theme layout */}
            {renderHeader()}

            {/* Resume Sections */}
            <div className={theme.spacing}>
              {sections
                .filter((section) => section.active)
                .map((section) => (
                  <div key={section.id} className="mb-6">
                    {renderSectionHeader(section)}

                    {/* Summary Section */}
                    {section.id === "summary" && (
                      <p className={`${theme.primary} ${theme.font.body}`}>
                        {section.content}
                      </p>
                    )}

                    {/* Education Section */}
                    {section.id === "education" && (
                      <div className="space-y-4">
                        {user.education?.map((edu, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between">
                              <h3
                                className={`font-medium text-base ${theme.subheading} ${theme.font.heading}`}
                              >
                                {edu.school}
                              </h3>
                              <span
                                className={`${theme.secondary} ${theme.font.body}`}
                              >
                                {edu.startYear} -{" "}
                                {edu.current ? "Present" : edu.endYear}
                              </span>
                            </div>
                            <p
                              className={`${theme.primary} ${theme.font.body}`}
                            >
                              {edu.degree} in {edu.branch}
                            </p>
                            <p
                              className={`${theme.secondary} ${theme.font.body}`}
                            >
                              {edu.type.charAt(0).toUpperCase() +
                                edu.type.slice(1)}
                              {edu.percentage ? ` • ${edu.percentage}%` : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Work Experience Section */}
                    {section.id === "workExperience" && (
                      <div className="space-y-4">
                        {user.workExperience?.map((work, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between">
                              <h3
                                className={`font-medium ${theme.subheading} ${theme.font.heading}`}
                              >
                                {work.company}
                              </h3>
                              <span
                                className={`${theme.secondary} ${theme.font.body}`}
                              >
                                {formatDate(work.startDate)} -{" "}
                                {work.current
                                  ? "Present"
                                  : formatDate(work.endDate)}
                              </span>
                            </div>
                            <p
                              className={`${theme.primary} ${theme.font.body}`}
                            >
                              {work.title} • {work.location}
                            </p>
                            <p
                              className={`${theme.secondary} ${theme.font.body}`}
                            >
                              {work.type.charAt(0).toUpperCase() +
                                work.type.slice(1)}{" "}
                              • {work.sector}
                            </p>
                            {work.description && (
                              <p
                                className={`mt-1 ${theme.primary} ${theme.font.body}`}
                              >
                                {work.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technical Skills Section - No skill level indicators */}
                    {section.id === "technicalSkills" && (
                      <div className="flex flex-wrap gap-2">
                        {user.technicalSkills?.map((skill, index) => (
                          <span
                            key={index}
                            className={`${theme.primary} ${
                              theme.font.body
                            } px-3 py-1 rounded-full bg-opacity-10 ${theme.primary.replace(
                              "text",
                              "bg"
                            )}`}
                          >
                            {skill.skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Projects Section */}
                    {section.id === "projects" && (
                      <div className="space-y-4">
                        {user.projects?.map((project, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between">
                              <h3
                                className={`font-medium ${theme.subheading} ${theme.font.heading}`}
                              >
                                {project.title}
                              </h3>
                              <span
                                className={`${theme.secondary} ${theme.font.body}`}
                              >
                                {formatDate(project.startDate)} -{" "}
                                {project.current
                                  ? "Present"
                                  : formatDate(project.endDate)}
                              </span>
                            </div>
                            <p
                              className={`${theme.secondary} ${theme.font.body}`}
                            >
                              {project.domain} •{" "}
                              {project.associatedWith.charAt(0).toUpperCase() +
                                project.associatedWith.slice(1)}
                            </p>
                            <p
                              className={`mt-1 ${theme.primary} ${theme.font.body}`}
                            >
                              {project.description}
                            </p>
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm ${theme.primary} hover:underline ${theme.font.body}`}
                              >
                                View Project
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Languages Section - No skill level indicators */}
                    {section.id === "languages" && (
                      <div className="flex flex-wrap gap-2">
                        {user.languages?.map((language, index) => (
                          <span
                            key={index}
                            className={`${theme.primary} ${
                              theme.font.body
                            } px-3 py-1 rounded-full bg-opacity-10 ${theme.primary.replace(
                              "text",
                              "bg"
                            )}`}
                          >
                            {language.language}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Certificates Section */}
                    {section.id === "certificates" && (
                      <div className="space-y-3">
                        {user.certificates?.map((cert, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between">
                              <h3
                                className={`font-medium ${theme.subheading} ${theme.font.heading}`}
                              >
                                {cert.title}
                              </h3>
                              <span
                                className={`${theme.secondary} ${theme.font.body}`}
                              >
                                {formatDate(cert.issueDate)}
                                {cert.doesExpire &&
                                  cert.expiryDate &&
                                  ` - ${formatDate(cert.expiryDate)}`}
                              </span>
                            </div>
                            <p
                              className={`${theme.secondary} ${theme.font.body}`}
                            >
                              Issued by {cert.issuer}
                            </p>
                            {cert.hasScore && cert.score && (
                              <p
                                className={`${theme.primary} ${theme.font.body}`}
                              >
                                Score: {cert.score}
                              </p>
                            )}
                            {cert.description && (
                              <p
                                className={`text-sm mt-1 ${theme.primary} ${theme.font.body}`}
                              >
                                {cert.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Awards Section */}
                    {section.id === "awards" && (
                      <div className="space-y-3">
                        {user.awards?.map((award, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between">
                              <h3
                                className={`font-medium ${theme.subheading} ${theme.font.heading}`}
                              >
                                {award.title}
                              </h3>
                              <span
                                className={`${theme.secondary} ${theme.font.body}`}
                              >
                                {formatDate(award.date)}
                              </span>
                            </div>
                            <p
                              className={`${theme.secondary} ${theme.font.body}`}
                            >
                              Issued by {award.issuer} •{" "}
                              {award.associatedWith.charAt(0).toUpperCase() +
                                award.associatedWith.slice(1)}
                            </p>
                            {award.description && (
                              <p
                                className={`text-sm mt-1 ${theme.primary} ${theme.font.body}`}
                              >
                                {award.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {renderATSModal()}
    </div>
  );
};

export default Resume;
