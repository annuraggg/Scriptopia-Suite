import {
  Document,
  Link,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Candidate } from "@shared-types/Candidate";

// Fix #1: Update Font registration with complete font data including weights
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff" },
    { 
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff",
      fontWeight: "bold" 
    },
  ]
});

Font.register({
  family: "IBM Plex Sans",
  fonts: [
    { src: "https://fonts.gstatic.com/s/ibmplexsans/v14/zYXgKVElMYYaJe8bpLHnCwDKhdHeFaxOedc.woff" },
    { 
      src: "https://fonts.gstatic.com/s/ibmplexsans/v14/zYX9KVElMYYaJe8bpLHnCwDKjWr7AIFsdP3pBms.woff", 
      fontWeight: "bold" 
    },
  ]
});

Font.register({
  family: "Manrope",
  fonts: [
    { src: "https://fonts.gstatic.com/s/manrope/v13/xn7gYHE41ni1AdIRggqxSuXd.woff" },
    { 
      src: "https://fonts.gstatic.com/s/manrope/v13/xn7gYHE41ni1AdIRggmxSuXd.woff", 
      fontWeight: "bold" 
    },
  ]
});

// Register fallback font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.cdnfonts.com/s/29136/helvetica-neue-55.woff', fontWeight: 'normal' },
    { src: 'https://fonts.cdnfonts.com/s/29136/helvetica-neue-75.woff', fontWeight: 'bold' },
  ]
});

const colorSchemes = {
  monochrome: {
    primary: "#1f2937",
    secondary: "#6b7280",
    heading: "#111827",
    subheading: "#374151",
    border: "#e5e7eb",
    background: "#ffffff",
  },
  warmGray: {
    primary: "#57534e",
    secondary: "#78716c",
    heading: "#44403c",
    subheading: "#57534e",
    border: "#e7e5e4",
    background: "#fafaf9",
  },
  coolGray: {
    primary: "#1e293b",
    secondary: "#64748b",
    heading: "#0f172a",
    subheading: "#334155",
    border: "#e2e8f0",
    background: "#ffffff",
  },
  inkBlue: {
    primary: "#1e293b",
    secondary: "#6b7280",
    heading: "#1e3a8a",
    subheading: "#1e40af",
    border: "#e5e7eb",
    background: "#ffffff",
  },
  earthtone: {
    primary: "#78350f",
    secondary: "#78716c",
    heading: "#451a03",
    subheading: "#92400e",
    border: "#e7e5e4",
    background: "#fafaf9",
  },
};

// Fix #2: Improved font family mapping function
const getFontFamily = (fontValue: string | string[]): string => {
  const fontString = Array.isArray(fontValue) ? fontValue.join(" ") : fontValue;
  
  if (fontString.includes("Inter")) return "Inter";
  if (fontString.includes("IBM_Plex_Sans") || fontString.includes("IBM Plex Sans")) return "IBM Plex Sans";
  if (fontString.includes("Manrope")) return "Manrope";
  if (fontString.includes("Roboto")) return "Helvetica"; // Fallback if Roboto isn't registered
  if (fontString.includes("SF_Pro_Text") || fontString.includes("SF Pro Text")) return "Helvetica"; // Fallback
  if (fontString.includes("Helvetica_Neue") || fontString.includes("Helvetica Neue")) return "Helvetica";
  
  return "Helvetica"; // Default fallback
};

const createPdfStyles = (theme: {
  colorScheme: string | number;
  font: { heading: string | string[]; body: string | string[] };
  spacing: string | string[];
  sectionHeadingStyle: string | string[];
  headerAlignment: string | string[];
  headerStyle: string | string[];
}) => {
  // Fix #3: Make sure colorScheme is treated as a string key
  const schemeKey = typeof theme.colorScheme === 'string' ? theme.colorScheme : 'monochrome';
  const colors = colorSchemes[schemeKey as keyof typeof colorSchemes] || colorSchemes.monochrome;

  // Fix #4: Get font families while debugging them
  const headingFont = getFontFamily(theme.font.heading);
  const bodyFont = getFontFamily(theme.font.body);
  
  console.log('Using fonts:', { headingFont, bodyFont });

  let sectionSpacing = 10;
  if (Array.isArray(theme.spacing)) {
    if (theme.spacing.includes("3")) sectionSpacing = 6;
    if (theme.spacing.includes("5")) sectionSpacing = 14;
  } else if (typeof theme.spacing === 'string') {
    if (theme.spacing.includes("3")) sectionSpacing = 6;
    if (theme.spacing.includes("5")) sectionSpacing = 14;
  }

  let sectionHeadingStyle: {
    textTransform?: string;
    fontSize?: number;
    letterSpacing?: number;
    fontWeight?: string;
    borderBottomWidth?: number;
    borderBottomColor?: string;
    paddingBottom?: number;
  } = {};
  
  // Fix #5: Ensure sectionHeadingStyle is processed correctly
  const sectionHeadingStr = Array.isArray(theme.sectionHeadingStyle) 
    ? theme.sectionHeadingStyle.join(" ") 
    : theme.sectionHeadingStyle;
    
  if (sectionHeadingStr.includes("uppercase")) {
    sectionHeadingStyle = {
      textTransform: "uppercase",
      fontSize: 10,
      letterSpacing: 1,
      fontWeight: "medium",
    };
  } else if (sectionHeadingStr.includes("border-b")) {
    sectionHeadingStyle = {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 4,
    };
  } else {
    sectionHeadingStyle = {
      fontWeight: "medium",
    };
  }

  // Fix #6: Make sure headerAlignment is correctly determined
  const headerAlignmentStr = Array.isArray(theme.headerAlignment) 
    ? theme.headerAlignment.join(" ") 
    : theme.headerAlignment;
    
  const headerAlignment = headerAlignmentStr.includes("center")
    ? "center"
    : "left";

  return StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: bodyFont,
      fontSize: 12,
      backgroundColor: colors.background,
      color: colors.primary,
    },
    section: {
      marginBottom: sectionSpacing,
    },
    header: {
      marginBottom: Array.isArray(theme.headerStyle) 
        ? theme.headerStyle.includes("6") ? 20 : 15
        : theme.headerStyle.includes("6") ? 20 : 15,
      textAlign: headerAlignment as any,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
      fontFamily: headingFont,
      color: colors.heading,
    },
    contactInfo: {
      marginBottom: 3,
      color: colors.secondary,
    },
    sectionTitle: {
      fontSize: sectionHeadingStyle.fontSize || 16,
      fontWeight: sectionHeadingStyle.fontWeight || "bold",
      marginBottom: 8,
      borderBottomWidth: sectionHeadingStyle.borderBottomWidth || 0,
      borderBottomColor: colors.border,
      paddingBottom: sectionHeadingStyle.paddingBottom || 0,
      textTransform:
        (sectionHeadingStyle.textTransform as
          | "uppercase"
          | "none"
          | undefined) || "none",
      letterSpacing: sectionHeadingStyle.letterSpacing || 0,
      color: colors.heading,
      fontFamily: headingFont,
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.heading,
      fontFamily: headingFont,
    },
    itemSubtitle: {
      fontSize: 13,
      marginBottom: 3,
      color: colors.subheading,
    },
    dates: {
      fontSize: 12,
      color: colors.secondary,
      marginBottom: 3,
    },
    description: {
      fontSize: 12,
      marginBottom: 5,
      color: colors.primary,
    },
    skills: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 5,
    },
    skill: {
      backgroundColor: colors.border,
      padding: 5,
      marginRight: 5,
      marginBottom: 5,
      borderRadius: 3,
      color: colors.primary,
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
      justifyContent: headerAlignment === "center" ? "center" : "flex-start",
    },
    link: {
      color: "#3b82f6",
      textDecoration: "underline",
    },
  });
};

interface ResumePDFProps {
  user: Candidate;
  activeSections: string[];
  theme?: any;
}

const ResumePDF = ({ user, activeSections, theme }: ResumePDFProps) => {
  // Fix #7: Ensure default theme is well-structured
  const defaultTheme = {
    name: "Minimal",
    colorScheme: "monochrome",
    primary: "text-gray-800",
    secondary: "text-gray-500",
    background: "bg-white",
    heading: "text-gray-900",
    subheading: "text-gray-700",
    border: "border-gray-200",
    font: {
      heading: ["Inter"],
      body: ["Inter"],
    },
    layout: "clean",
    spacing: ["space-y-4"],
    headerStyle: ["mb-6"],
    headerAlignment: ["text-left"],
    sectionHeadingStyle: ["uppercase", "text-xs", "tracking-wider", "font-medium"],
  };

  const activeTheme = theme || defaultTheme;

  const pdfStyles = createPdfStyles(activeTheme);

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

export default ResumePDF;