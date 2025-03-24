import { Document, Link, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// First, let's define PDF styles using StyleSheet
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contactInfo: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemSubtitle: {
    fontSize: 13,
    marginBottom: 3,
  },
  dates: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    marginBottom: 5,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  skill: {
    backgroundColor: "#e6f7ff",
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  socialLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 5,
  },
  link: {
    color: "blue",
    textDecoration: "underline",
  },
});

// Create a PDF Document component for the resume
const ResumePDF = ({ user, activeSections }) => {
  const formatDate = (date?: Date | string): string => {
    if (!date) return "Present";
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <Document
      title={`${user.name} Resume`}
      author={user.name}
      subject="Professional Resume"
      keywords="resume, professional, job application"
      creator="Resume Builder App"
    >
      <Page size="A4" style={pdfStyles.page}>
        {/* Header */}
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.headerTitle}>{user.name}</Text>
          <Text style={pdfStyles.contactInfo}>
            {user.email} | {user.phone}
          </Text>
          <Text style={pdfStyles.contactInfo}>{user.address}</Text>

          {user.socialLinks && user.socialLinks.length > 0 && (
            <View style={pdfStyles.socialLinks}>
              {user.socialLinks.map((link, index) => (
                <Link key={index} src={link.url} style={pdfStyles.link}>
                  {link.platform}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Summary Section */}
        {activeSections.includes("summary") && user.summary && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Summary</Text>
            <Text style={pdfStyles.description}>{user.summary}</Text>
          </View>
        )}

        {/* Education Section */}
        {activeSections.includes("education") &&
          user.education &&
          user.education.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>Education</Text>
              {user.education.map((edu, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View style={pdfStyles.row}>
                    <Text style={pdfStyles.itemTitle}>{edu.school}</Text>
                    <Text style={pdfStyles.dates}>
                      {edu.startYear} - {edu.current ? "Present" : edu.endYear}
                    </Text>
                  </View>
                  <Text style={pdfStyles.itemSubtitle}>
                    {edu.degree} in {edu.branch}
                  </Text>
                  <Text style={pdfStyles.description}>
                    {edu.type.charAt(0).toUpperCase() + edu.type.slice(1)}
                    {edu.percentage ? ` • ${edu.percentage}%` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {/* Work Experience Section */}
        {activeSections.includes("workExperience") &&
          user.workExperience &&
          user.workExperience.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>Work Experience</Text>
              {user.workExperience.map((work, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View style={pdfStyles.row}>
                    <Text style={pdfStyles.itemTitle}>{work.company}</Text>
                    <Text style={pdfStyles.dates}>
                      {formatDate(work.startDate)} -{" "}
                      {work.current ? "Present" : formatDate(work.endDate)}
                    </Text>
                  </View>
                  <Text style={pdfStyles.itemSubtitle}>
                    {work.title} • {work.location}
                  </Text>
                  <Text style={pdfStyles.description}>
                    {work.type.charAt(0).toUpperCase() + work.type.slice(1)} •{" "}
                    {work.sector}
                  </Text>
                  {work.description && (
                    <Text style={pdfStyles.description}>
                      {work.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

        {/* Technical Skills Section */}
        {activeSections.includes("technicalSkills") &&
          user.technicalSkills &&
          user.technicalSkills.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>Technical Skills</Text>
              <View style={pdfStyles.skills}>
                {user.technicalSkills.map((skill, index) => (
                  <View key={index} style={pdfStyles.skill}>
                    <Text>{skill.skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Projects Section */}
        {activeSections.includes("projects") &&
          user.projects &&
          user.projects.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>Projects</Text>
              {user.projects.map((project, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View style={pdfStyles.row}>
                    <Text style={pdfStyles.itemTitle}>{project.title}</Text>
                    <Text style={pdfStyles.dates}>
                      {formatDate(project.startDate)} -{" "}
                      {project.current
                        ? "Present"
                        : formatDate(project.endDate)}
                    </Text>
                  </View>
                  <Text style={pdfStyles.itemSubtitle}>
                    {project.domain} •{" "}
                    {project.associatedWith.charAt(0).toUpperCase() +
                      project.associatedWith.slice(1)}
                  </Text>
                  <Text style={pdfStyles.description}>
                    {project.description}
                  </Text>
                  {project.url && (
                    <Link src={project.url} style={pdfStyles.link}>
                      View Project
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}

        {/* Languages Section */}
        {activeSections.includes("languages") &&
          user.languages &&
          user.languages.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>Languages</Text>
              <View style={pdfStyles.skills}>
                {user.languages.map((language, index) => (
                  <View key={index} style={pdfStyles.skill}>
                    <Text>{language.language}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Certificates Section */}
        {activeSections.includes("certificates") &&
          user.certificates &&
          user.certificates.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>Certificates</Text>
              {user.certificates.map((cert, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View style={pdfStyles.row}>
                    <Text style={pdfStyles.itemTitle}>{cert.title}</Text>
                    <Text style={pdfStyles.dates}>
                      {formatDate(cert.issueDate)}
                      {cert.doesExpire &&
                        cert.expiryDate &&
                        ` - ${formatDate(cert.expiryDate)}`}
                    </Text>
                  </View>
                  <Text style={pdfStyles.itemSubtitle}>
                    Issued by {cert.issuer}
                  </Text>
                  {cert.hasScore && cert.score && (
                    <Text style={pdfStyles.description}>
                      Score: {cert.score}
                    </Text>
                  )}
                  {cert.description && (
                    <Text style={pdfStyles.description}>
                      {cert.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

        {/* Awards Section */}
        {activeSections.includes("awards") &&
          user.awards &&
          user.awards.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>Awards</Text>
              {user.awards.map((award, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View style={pdfStyles.row}>
                    <Text style={pdfStyles.itemTitle}>{award.title}</Text>
                    <Text style={pdfStyles.dates}>
                      {formatDate(award.date)}
                    </Text>
                  </View>
                  <Text style={pdfStyles.itemSubtitle}>
                    Issued by {award.issuer} •{" "}
                    {award.associatedWith.charAt(0).toUpperCase() +
                      award.associatedWith.slice(1)}
                  </Text>
                  {award.description && (
                    <Text style={pdfStyles.description}>
                      {award.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
      </Page>
    </Document>
  );
};

export default ResumePDF