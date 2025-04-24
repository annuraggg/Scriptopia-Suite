import { faker } from "@faker-js/faker";
import Institute from "@/models/Institute";
import clerkClient from "@/config/clerk";
import { generate } from "generate-passphrase";
import User from "@/models/User";
import Candidate from "@/models/Candidate";
import sampleDepartments from "@/data/samples/institute/departments";

const CANDIDATES_LIMIT = 2;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateSampleInstituteData = async (instituteId: string) => {
  const institute = await Institute.findById(instituteId);
  if (!institute) {
    throw new Error("Institute not found");
  }

  await generateSampleInstituteDepartments(instituteId);
  await generateSampleInstituteCandidates(instituteId);
};

const generateSampleInstituteDepartments = async (instituteId: string) => {
  await Institute.updateOne(
    { _id: instituteId },
    { $set: { departments: sampleDepartments } }
  );

  await Institute.updateOne(
    { _id: instituteId },
    {
      $push: {
        auditLogs: {
          action: "Added sample departments",
          user: "System",
          userId: "system",
          type: "info",
        },
      },
    }
  );
};

const generateRandomCandidate = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet
    .email({ firstName, lastName, provider: "example.com" })
    .toLowerCase();

  let username = faker.internet.username({ firstName, lastName }).toLowerCase();
  username = username.replace(/[^a-z0-9_-]/g, "_");

  return {
    firstName,
    lastName,
    email,
    username,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    dob: faker.date.birthdate({ min: 18, max: 30, mode: "age" }).toISOString(),
  };
};

const generateSampleInstituteCandidates = async (instituteId: string) => {
  const passphrase = generate({
    fast: true,
    separator: "-",
    length: 3,
    numbers: false,
  });

  const candidates = Array.from({ length: CANDIDATES_LIMIT }).map(() =>
    generateRandomCandidate()
  );

  for (const candidate of candidates) {
    await clerkClient.users.createUser({
      skipPasswordChecks: true,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      password: passphrase,
      emailAddress: [candidate.email],
      username: candidate.username,
      legalAcceptedAt: new Date(),
      privateMetadata: { isSample: true, sampleInstituteId: instituteId },
    });

    await delay(1000);
  }

  const dbUsers = await User.find({
    isSample: true,
    sampleInstituteId: instituteId,
  }).lean();

  console.log("DB Users", dbUsers);

  for (const user of dbUsers) {
    const clerkUser = await clerkClient.users.getUser(user.clerkId);

    const newCandidate = new Candidate({
      userId: user._id,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      dob: faker.date.birthdate({ min: 18, max: 30, mode: "age" }),
      gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
      email: user.email,
      phone: faker.phone.number(),
      address: faker.location.streetAddress(true),
      summary: faker.lorem.paragraph(),
      profileImage: faker.image.avatar(),

      socialLinks: Array.from({
        length: faker.number.int({ min: 1, max: 3 }),
      }).map(() => ({
        platform: faker.helpers.arrayElement([
          "linkedin",
          "github",
          "twitter",
          "facebook",
          "instagram",
          "portfolio",
        ]),
        url: faker.internet.url(),
      })),

      education: Array.from({
        length: faker.number.int({ min: 1, max: 3 }),
      }).map(() => {
        const startYear = faker.number.int({ min: 2010, max: 2022 });
        const endYear = faker.datatype.boolean()
          ? startYear + faker.number.int({ min: 1, max: 4 })
          : null;
        const activeBacklogs = faker.number.int({ min: 0, max: 3 });
        const totalBacklogs =
          activeBacklogs + faker.number.int({ min: activeBacklogs, max: 2 });

        return {
          school: faker.company.name() + " University",
          degree: faker.helpers.arrayElement([
            "Bachelor of Science",
            "Bachelor of Arts",
            "Master of Science",
            "PhD",
            "Diploma",
            "Bachelor of Engineering",
          ]),
          board: faker.helpers.arrayElement([
            "University Board",
            "State Board of Education",
            "National Board",
            "International Board",
            "MSBTE",
            "Mumbai University",
          ]),
          branch: faker.helpers.arrayElement([
            "Computer Science",
            "Information Technology",
            "Engineering",
            "Business",
            "Arts",
            "Science",
          ]),
          startYear,
          endYear,
          current: endYear === null,
          type: faker.helpers.arrayElement([
            "fulltime",
            "parttime",
            "distance",
          ]),
          percentage: faker.number.float({
            min: 60,
            max: 95,
            fractionDigits: 1,
          }),
          activeBacklogs,
          totalBacklogs,
          clearedBacklogs: totalBacklogs - activeBacklogs,
          backlogHistory: Array.from({
            length: totalBacklogs
              ? faker.number.int({ min: 0, max: totalBacklogs })
              : 0,
          }).map(() => ({
            subject: faker.helpers.arrayElement([
              "Advanced Algorithms",
              "Compiler Design",
              "Database Systems",
              "Computer Networks",
            ]),
            semester: faker.number.int({ min: 1, max: 8 }),
            cleared: faker.datatype.boolean(),
            attemptCount: faker.number.int({ min: 1, max: 3 }),
            clearedDate: faker.date.recent(),
          })),
          createdAt: faker.date.recent(),
        };
      }),

      workExperience: Array.from({
        length: faker.number.int({ min: 0, max: 2 }),
      }).map(() => {
        const startDate = faker.date.past({ years: 3 });
        const endDate = faker.datatype.boolean()
          ? faker.date.between({ from: startDate, to: new Date() })
          : null;

        return {
          company: faker.company.name(),
          sector: faker.helpers.arrayElement([
            "Technology",
            "Finance",
            "Healthcare",
            "Education",
            "Retail",
          ]),
          title: faker.person.jobTitle(),
          location: `${faker.location.city()}, ${faker.location.state()}`,
          type: faker.helpers.arrayElement([
            "fulltime",
            "parttime",
            "internship",
            "contract",
            "freelance",
          ]),
          jobFunction: faker.helpers.arrayElement([
            "Development",
            "Design",
            "Data Analysis",
            "Marketing",
            "Sales",
          ]),
          startDate,
          endDate,
          current: endDate === null,
          description: faker.lorem.paragraph(),
          createdAt: faker.date.recent(),
        };
      }),

      technicalSkills: Array.from({
        length: faker.number.int({ min: 3, max: 8 }),
      }).map(() => ({
        skill: faker.helpers.arrayElement([
          "JavaScript",
          "Python",
          "Java",
          "C++",
          "React",
          "Node.js",
          "MongoDB",
          "SQL",
          "Machine Learning",
        ]),
        proficiency: faker.number.int({ min: 5, max: 10 }),
        createdAt: faker.date.recent(),
      })),

      languages: Array.from({
        length: faker.number.int({ min: 1, max: 3 }),
      }).map(() => ({
        language: faker.helpers.arrayElement([
          "English",
          "Spanish",
          "French",
          "German",
          "Chinese",
          "Japanese",
        ]),
        proficiency: faker.number.int({ min: 5, max: 10 }),
        createdAt: faker.date.recent(),
      })),

      subjects: Array.from({
        length: faker.number.int({ min: 2, max: 5 }),
      }).map(() => ({
        subject: faker.helpers.arrayElement([
          "Database Systems",
          "Artificial Intelligence",
          "Computer Networks",
          "Data Structures",
        ]),
        proficiency: faker.number.int({ min: 5, max: 10 }),
        createdAt: faker.date.recent(),
      })),

      projects: Array.from({
        length: faker.number.int({ min: 1, max: 3 }),
      }).map(() => {
        const startDate = faker.date.past({ years: 2 });
        const endDate = faker.datatype.boolean()
          ? faker.date.between({ from: startDate, to: new Date() })
          : null;

        return {
          title: faker.helpers.arrayElement([
            "Smart Home Automation System",
            "Machine Learning Stock Predictor",
            "E-commerce Platform",
            "Social Media Dashboard",
            "Personal Finance Tracker",
          ]),
          domain: faker.helpers.arrayElement([
            "Web Development",
            "Mobile Development",
            "Machine Learning",
            "IoT",
            "Cloud Computing",
          ]),
          startDate,
          endDate,
          current: endDate === null,
          associatedWith: faker.helpers.arrayElement([
            "personal",
            "academic",
            "professional",
          ]),
          description: faker.lorem.paragraph(),
          url: faker.internet.url(),
          createdAt: faker.date.recent(),
        };
      }),

      certificates: Array.from({
        length: faker.number.int({ min: 0, max: 2 }),
      }).map(() => {
        const issueDate = faker.date.past({ years: 2 });
        const doesExpire = faker.datatype.boolean();
        const hasScore = faker.datatype.boolean();

        return {
          title: faker.helpers.arrayElement([
            "AWS Certified Solutions Architect",
            "Google Cloud Professional",
            "Microsoft Certified: Azure Developer",
            "Certified Data Scientist",
            "Full Stack Web Development",
          ]),
          issuer: faker.company.name(),
          url: faker.internet.url(),
          licenseNumber: faker.datatype.boolean()
            ? faker.string.alphanumeric(10)
            : null,
          issueDate,
          doesExpire,
          expiryDate: doesExpire
            ? faker.date.future({ years: 3, refDate: issueDate })
            : null,
          hasScore,
          score: hasScore ? faker.number.int({ min: 700, max: 990 }) : null,
          description: faker.lorem.sentence(),
          createdAt: faker.date.recent(),
        };
      }),

      resumeUrl: faker.internet.url(),
      institute: instituteId,
      instituteUid: faker.string.alphanumeric(10),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newCandidate.save();
  }

  await Institute.updateOne(
    { _id: instituteId },
    {
      $push: {
        auditLogs: {
          action: `Added ${CANDIDATES_LIMIT} sample candidates`,
          user: "System",
          userId: "system",
          type: "info",
        },
      },
    }
  );
};

// generateSampleInstituteCandidates("67f23bc672617f99ac1c227b");

export default generateSampleInstituteData;
