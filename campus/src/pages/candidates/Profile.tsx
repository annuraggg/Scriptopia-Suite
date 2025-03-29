import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Link,
  ScrollShadow,
  Divider,
  Chip,
} from "@nextui-org/react";
import {
  FileBadgeIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CodeIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  GlobeIcon,
  BookOpenIcon,
  UserIcon,
  CalendarIcon,
  FlagIcon,
  GlobeLockIcon,
  HeartHandshakeIcon,
  PaletteIcon,
  BookIcon,
  ScrollTextIcon,
  LandmarkIcon,
  BadgeIcon,
  FileQuestionIcon,
} from "lucide-react";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Candidate } from "@shared-types/Candidate";

type SidebarNavItem = {
  key: string;
  icon: React.ElementType;
  label: string;
  renderContent: (candidate: any) => React.ReactNode;
};

const ProfilePage: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("workExperience");

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    const candId = window.location.pathname.split("/").pop();
    axios
      .get(`institutes/candidate/${candId}`)
      .then((response) => {
        setCandidate(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Error fetching candidate");
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!candidate) return <div>No candidate data found</div>;

  const InfoCard = ({
    title,
    data,
    renderItem,
    emptyMessage = "No information available",
  }: {
    title: string;
    data: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    emptyMessage?: string;
  }) => (
    <Card className="mb-6 shadow-md">
      <CardBody className="p-6">
        <div className="flex items-center mb-4 border-b pb-2">
          <BookOpenIcon className="mr-3 text-primary" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <ScrollShadow hideScrollBar className="max-h-[400px]">
          {data?.length ? (
            data.map(renderItem)
          ) : (
            <p className="text-gray-500 italic">{emptyMessage}</p>
          )}
        </ScrollShadow>
      </CardBody>
    </Card>
  );

  const ProfileOverview = () => (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <div className="flex items-center space-x-4">
        <UserIcon className="text-primary shrink-0" size={48} />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-800 truncate">
            {candidate.name}
          </h1>
          <p className="text-gray-600 text-sm truncate">
            {candidate.summary || "No summary provided"}
          </p>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-2 truncate">
          <MailIcon className="text-gray-500 shrink-0" size={14} />
          <Link
            href={`mailto:${candidate.email}`}
            color="foreground"
            className="truncate"
          >
            {candidate.email}
          </Link>
        </div>
        <div className="flex items-center space-x-2 truncate">
          <PhoneIcon className="text-gray-500 shrink-0" size={14} />
          <span className="truncate">{candidate.phone}</span>
        </div>
        <div className="flex items-center space-x-2 truncate">
          <MapPinIcon className="text-gray-500 shrink-0" size={14} />
          <span className="truncate">{candidate.address}</span>
        </div>
        <div className="flex items-center space-x-2 truncate">
          <CalendarIcon className="text-gray-500 shrink-0" size={14} />
          <span className="truncate">
            {new Date(candidate.dob).toLocaleDateString()} | {candidate.gender}
          </span>
        </div>
      </div>
    </div>
  );

  const sidebarNavItems: SidebarNavItem[] = [
    {
      key: "workExperience",
      icon: BriefcaseIcon,
      label: "Work Experience",
      renderContent: () => (
        <InfoCard
          title="Professional Journey"
          data={candidate.workExperience || []}
          renderItem={(work, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{work.title}</h3>
              <p className="text-gray-600">
                {work.company} | {work.location}
              </p>
              <p>
                {new Date(work.startDate).toLocaleDateString()} -{" "}
                {work.current
                  ? "Present"
                  : new Date(work.endDate!).toLocaleDateString()}
              </p>
              <Chip color="primary" variant="flat" className="mt-2">
                {work.type}
              </Chip>
              {work.description && (
                <p className="mt-2 text-gray-700">{work.description}</p>
              )}
            </div>
          )}
        />
      ),
    },
    {
      key: "education",
      icon: GraduationCapIcon,
      label: "Education",
      renderContent: () => (
        <InfoCard
          title="Educational Background"
          data={candidate.education || []}
          renderItem={(edu, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <p className="text-gray-600">
                {edu.school} | {edu.board}
              </p>
              <p>
                {edu.startYear} - {edu.current ? "Present" : edu.endYear} |{" "}
                {edu.percentage}% | {edu.branch}
              </p>
              <Chip color="secondary" variant="flat" className="mt-2">
                {edu.type}
              </Chip>
            </div>
          )}
        />
      ),
    },
    {
      key: "technicalSkills",
      icon: CodeIcon,
      label: "Technical Skills",
      renderContent: () => (
        <InfoCard
          title="Skill Proficiency"
          data={candidate.technicalSkills || []}
          renderItem={(skill, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-3 pb-3 border-b last:border-b-0"
            >
              <span>{skill.skill}</span>
              <Chip color="secondary" variant="flat">
                {skill.proficiency}/5
              </Chip>
            </div>
          )}
        />
      ),
    },
    {
      key: "social",
      icon: GlobeIcon,
      label: "Social Links",
      renderContent: () => (
        <InfoCard
          title="Social Connections"
          data={candidate.socialLinks || []}
          renderItem={(link, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-3 pb-3 border-b last:border-b-0"
            >
              <div className="flex items-center">
                <span className="mr-3 capitalize">{link.platform}</span>
                <Link href={link.url} target="_blank" color="primary">
                  {link.url}
                </Link>
              </div>
            </div>
          )}
        />
      ),
    },
    {
      key: "languages",
      icon: FlagIcon,
      label: "Languages",
      renderContent: () => (
        <InfoCard
          title="Language Proficiency"
          data={candidate.languages || []}
          renderItem={(lang, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-3 pb-3 border-b last:border-b-0"
            >
              <span>{lang.language}</span>
              <Chip color="primary" variant="flat">
                {lang.proficiency}/5
              </Chip>
            </div>
          )}
        />
      ),
    },
    {
      key: "subjects",
      icon: BookIcon,
      label: "Subjects",
      renderContent: () => (
        <InfoCard
          title="Subject Expertise"
          data={candidate.subjects || []}
          renderItem={(subject, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-3 pb-3 border-b last:border-b-0"
            >
              <span>{subject.subject}</span>
              <Chip color="secondary" variant="flat">
                {subject.proficiency}%
              </Chip>
            </div>
          )}
        />
      ),
    },
    {
      key: "projects",
      icon: LandmarkIcon,
      label: "Projects",
      renderContent: () => (
        <InfoCard
          title="Project Portfolio"
          data={candidate.projects || []}
          renderItem={(project, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-gray-600">{project.domain}</p>
              <p>
                {new Date(project.startDate).toLocaleDateString()} -{" "}
                {project.current
                  ? "Present"
                  : new Date(project.endDate!).toLocaleDateString()}
              </p>
              <Chip color="primary" variant="flat" className="mt-2">
                {project.associatedWith}
              </Chip>
              <p className="mt-2 text-gray-700">{project.description}</p>
              {project.url && (
                <Link
                  href={project.url}
                  target="_blank"
                  className="text-primary mt-2"
                >
                  View Project
                </Link>
              )}
            </div>
          )}
        />
      ),
    },
    {
      key: "responsibilities",
      icon: ScrollTextIcon,
      label: "Responsibilities",
      renderContent: () => (
        <InfoCard
          title="Professional Responsibilities"
          data={candidate.responsibilities || []}
          renderItem={(resp, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{resp.title}</h3>
              <p className="text-gray-600">{resp.organization}</p>
              <p>
                {new Date(resp.startDate).toLocaleDateString()} -{" "}
                {resp.current
                  ? "Present"
                  : new Date(resp.endDate!).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-700">{resp.description}</p>
            </div>
          )}
        />
      ),
    },
    {
      key: "awards",
      icon: BadgeIcon,
      label: "Awards",
      renderContent: () => (
        <InfoCard
          title="Achievements & Honors"
          data={candidate.awards || []}
          renderItem={(award, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{award.title}</h3>
              <p className="text-gray-600">{award.issuer}</p>
              <Chip color="secondary" variant="flat" className="mt-2">
                {award.associatedWith}
              </Chip>
              <p className="mt-2 text-gray-700">{award.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(award.date).toLocaleDateString()}
              </p>
            </div>
          )}
        />
      ),
    },
    {
      key: "certificates",
      icon: FileBadgeIcon,
      label: "Certificates",
      renderContent: () => (
        <InfoCard
          title="Professional Certificates"
          data={candidate.certificates || []}
          renderItem={(cert, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{cert.title}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              <p>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
              {cert.hasScore && (
                <Chip color="primary" variant="flat" className="mt-2">
                  Score: {cert.score}%
                </Chip>
              )}
            </div>
          )}
        />
      ),
    },
    {
      key: "competitions",
      icon: FileQuestionIcon,
      label: "Competitions",
      renderContent: () => (
        <InfoCard
          title="Competitive Achievements"
          data={candidate.competitions || []}
          renderItem={(comp, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{comp.title}</h3>
              <p className="text-gray-600">{comp.organizer}</p>
              <Chip color="secondary" variant="flat" className="mt-2">
                {comp.position}
              </Chip>
              <p className="mt-2 text-gray-700">{comp.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(comp.date).toLocaleDateString()}
              </p>
            </div>
          )}
        />
      ),
    },
    {
      key: "patents",
      icon: GlobeLockIcon,
      label: "Patents",
      renderContent: () => (
        <InfoCard
          title="Intellectual Property"
          data={candidate.patents || []}
          renderItem={(patent, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{patent.title}</h3>
              <p className="text-gray-600">
                {patent.patentOffice} | {patent.patentNumber}
              </p>
              <Chip color="secondary" variant="flat" className="mt-2">
                {patent.status}
              </Chip>
              <p className="text-sm text-gray-500 mt-1">
                Filed: {new Date(patent.filingDate).toLocaleDateString()}
                {patent.issueDate &&
                  ` | Issued: ${new Date(
                    patent.issueDate
                  ).toLocaleDateString()}`}
              </p>
            </div>
          )}
        />
      ),
    },
    {
      key: "volunteering",
      icon: HeartHandshakeIcon,
      label: "Volunteering",
      renderContent: () => (
        <InfoCard
          title="Community Involvement"
          data={candidate.volunteerings || []}
          renderItem={(volunteer, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{volunteer.role}</h3>
              <p className="text-gray-600">
                {volunteer.organization} | {volunteer.cause}
              </p>
              <p>
                {new Date(volunteer.startDate).toLocaleDateString()} -{" "}
                {volunteer.current
                  ? "Present"
                  : new Date(volunteer.endDate!).toLocaleDateString()}
              </p>
            </div>
          )}
        />
      ),
    },
    {
      key: "extraCurricular",
      icon: PaletteIcon,
      label: "Extra Curricular",
      renderContent: () => (
        <InfoCard
          title="Beyond Academics"
          data={candidate.extraCurriculars || []}
          renderItem={(activity, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{activity.title}</h3>
              <p className="text-gray-600">{activity.category}</p>
              <p>
                {new Date(activity.startDate).toLocaleDateString()} -{" "}
                {activity.current
                  ? "Present"
                  : new Date(activity.endDate!).toLocaleDateString()}
              </p>
            </div>
          )}
        />
      ),
    },
  ];

  return (
    <div className="h-screen bg-gray-50 p-5 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <ProfileOverview />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg overflow-y-auto">
            <nav className="p-4 space-y-2">
              {sidebarNavItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`
                    w-full flex items-center p-3 rounded-lg transition-all duration-200
                    ${
                      activeTab === item.key
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 text-gray-700 hover:text-primary"
                    }
                  `}
                >
                  <item.icon className="mr-3" size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3 overflow-y-auto">
            <div className="space-y-6 pr-4">
              {sidebarNavItems
                .find((item) => item.key === activeTab)
                ?.renderContent(candidate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
