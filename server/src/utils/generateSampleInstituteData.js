"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = require("@faker-js/faker");
var Institute_1 = require("../models/Institute");
var clerk_1 = require("../config/clerk");
var generate_passphrase_1 = require("generate-passphrase");
var User_1 = require("../models/User");
var Candidate_1 = require("../models/Candidate");
var departments_1 = require("../data/samples/institute/departments");
var CANDIDATES_LIMIT = 100;
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var generateSampleInstituteData = function (instituteId) { return __awaiter(void 0, void 0, void 0, function () {
    var institute;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Institute_1.default.findById(instituteId)];
            case 1:
                institute = _a.sent();
                if (!institute) {
                    throw new Error("Institute not found");
                }
                return [4 /*yield*/, generateSampleInstituteDepartments(instituteId)];
            case 2:
                _a.sent();
                return [4 /*yield*/, generateSampleInstituteCandidates(instituteId)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var generateSampleInstituteDepartments = function (instituteId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Institute_1.default.updateOne({ _id: instituteId }, { $set: { departments: departments_1.default } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, Institute_1.default.updateOne({ _id: instituteId }, {
                        $push: {
                            auditLogs: {
                                action: "Added sample departments",
                                user: "System",
                                userId: "system",
                                type: "info",
                            },
                        },
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var generateRandomCandidate = function () {
    var firstName = faker_1.faker.person.firstName();
    var lastName = faker_1.faker.person.lastName();
    var email = faker_1.faker.internet
        .email({ firstName: firstName, lastName: lastName, provider: "example.com" })
        .toLowerCase();
    var username = faker_1.faker.internet
        .username({ firstName: firstName, lastName: lastName })
        .toLowerCase();
    return {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        gender: faker_1.faker.helpers.arrayElement(["Male", "Female", "Other"]),
        dob: faker_1.faker.date.birthdate({ min: 18, max: 30, mode: "age" }).toISOString(),
    };
};
var generateSampleInstituteCandidates = function (instituteId) { return __awaiter(void 0, void 0, void 0, function () {
    var passphrase, candidates, _i, candidates_1, candidate, dbUsers, _a, dbUsers_1, user, clerkUser, newCandidate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                passphrase = (0, generate_passphrase_1.generate)({
                    fast: true,
                    separator: "-",
                    length: 3,
                    numbers: false,
                });
                candidates = Array.from({ length: CANDIDATES_LIMIT }).map(function () {
                    return generateRandomCandidate();
                });
                _i = 0, candidates_1 = candidates;
                _b.label = 1;
            case 1:
                if (!(_i < candidates_1.length)) return [3 /*break*/, 5];
                candidate = candidates_1[_i];
                return [4 /*yield*/, clerk_1.default.users.createUser({
                        skipPasswordChecks: true,
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                        password: passphrase,
                        emailAddress: [candidate.email],
                        username: candidate.username,
                        legalAcceptedAt: new Date(),
                        privateMetadata: { isSample: true, sampleInstituteId: instituteId },
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, delay(1000)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [4 /*yield*/, User_1.default.find({
                    isSample: true,
                    sampleInstituteId: instituteId,
                }).lean()];
            case 6:
                dbUsers = _b.sent();
                _a = 0, dbUsers_1 = dbUsers;
                _b.label = 7;
            case 7:
                if (!(_a < dbUsers_1.length)) return [3 /*break*/, 11];
                user = dbUsers_1[_a];
                return [4 /*yield*/, clerk_1.default.users.getUser(user.clerkId)];
            case 8:
                clerkUser = _b.sent();
                newCandidate = new Candidate_1.default({
                    userId: user._id,
                    name: "".concat(clerkUser.firstName, " ").concat(clerkUser.lastName),
                    dob: faker_1.faker.date.birthdate({ min: 18, max: 30, mode: "age" }),
                    gender: faker_1.faker.helpers.arrayElement(["Male", "Female", "Other"]),
                    email: user.email,
                    phone: faker_1.faker.phone.number(),
                    address: faker_1.faker.location.streetAddress(true),
                    summary: faker_1.faker.lorem.paragraph(),
                    profileImage: faker_1.faker.image.avatar(),
                    socialLinks: Array.from({
                        length: faker_1.faker.number.int({ min: 1, max: 3 }),
                    }).map(function () { return ({
                        platform: faker_1.faker.helpers.arrayElement([
                            "linkedin",
                            "github",
                            "twitter",
                            "facebook",
                            "instagram",
                            "portfolio",
                        ]),
                        url: faker_1.faker.internet.url(),
                    }); }),
                    education: Array.from({
                        length: faker_1.faker.number.int({ min: 1, max: 3 }),
                    }).map(function () {
                        var startYear = faker_1.faker.number.int({ min: 2010, max: 2022 });
                        var endYear = faker_1.faker.datatype.boolean()
                            ? startYear + faker_1.faker.number.int({ min: 1, max: 4 })
                            : null;
                        var activeBacklogs = faker_1.faker.number.int({ min: 0, max: 3 });
                        var totalBacklogs = activeBacklogs + faker_1.faker.number.int({ min: activeBacklogs, max: 2 });
                        return {
                            school: faker_1.faker.company.name() + " University",
                            degree: faker_1.faker.helpers.arrayElement([
                                "Bachelor of Science",
                                "Bachelor of Arts",
                                "Master of Science",
                                "PhD",
                                "Diploma",
                                "Bachelor of Engineering",
                            ]),
                            board: faker_1.faker.helpers.arrayElement([
                                "University Board",
                                "State Board of Education",
                                "National Board",
                                "International Board",
                                "MSBTE",
                                "Mumbai University",
                            ]),
                            branch: faker_1.faker.helpers.arrayElement([
                                "Computer Science",
                                "Information Technology",
                                "Engineering",
                                "Business",
                                "Arts",
                                "Science",
                            ]),
                            startYear: startYear,
                            endYear: endYear,
                            current: endYear === null,
                            type: faker_1.faker.helpers.arrayElement([
                                "fulltime",
                                "parttime",
                                "distance",
                            ]),
                            percentage: faker_1.faker.number.float({
                                min: 60,
                                max: 95,
                                fractionDigits: 1,
                            }),
                            activeBacklogs: activeBacklogs,
                            totalBacklogs: totalBacklogs,
                            clearedBacklogs: totalBacklogs - activeBacklogs,
                            backlogHistory: Array.from({
                                length: totalBacklogs
                                    ? faker_1.faker.number.int({ min: 0, max: totalBacklogs })
                                    : 0,
                            }).map(function () { return ({
                                subject: faker_1.faker.helpers.arrayElement([
                                    "Advanced Algorithms",
                                    "Compiler Design",
                                    "Database Systems",
                                    "Computer Networks",
                                ]),
                                semester: faker_1.faker.number.int({ min: 1, max: 8 }),
                                cleared: faker_1.faker.datatype.boolean(),
                                attemptCount: faker_1.faker.number.int({ min: 1, max: 3 }),
                                clearedDate: faker_1.faker.date.recent(),
                            }); }),
                            createdAt: faker_1.faker.date.recent(),
                        };
                    }),
                    workExperience: Array.from({
                        length: faker_1.faker.number.int({ min: 0, max: 2 }),
                    }).map(function () {
                        var startDate = faker_1.faker.date.past({ years: 3 });
                        var endDate = faker_1.faker.datatype.boolean()
                            ? faker_1.faker.date.between({ from: startDate, to: new Date() })
                            : null;
                        return {
                            company: faker_1.faker.company.name(),
                            sector: faker_1.faker.helpers.arrayElement([
                                "Technology",
                                "Finance",
                                "Healthcare",
                                "Education",
                                "Retail",
                            ]),
                            title: faker_1.faker.person.jobTitle(),
                            location: "".concat(faker_1.faker.location.city(), ", ").concat(faker_1.faker.location.state()),
                            type: faker_1.faker.helpers.arrayElement([
                                "fulltime",
                                "parttime",
                                "internship",
                                "contract",
                                "freelance",
                            ]),
                            jobFunction: faker_1.faker.helpers.arrayElement([
                                "Development",
                                "Design",
                                "Data Analysis",
                                "Marketing",
                                "Sales",
                            ]),
                            startDate: startDate,
                            endDate: endDate,
                            current: endDate === null,
                            description: faker_1.faker.lorem.paragraph(),
                            createdAt: faker_1.faker.date.recent(),
                        };
                    }),
                    technicalSkills: Array.from({
                        length: faker_1.faker.number.int({ min: 3, max: 8 }),
                    }).map(function () { return ({
                        skill: faker_1.faker.helpers.arrayElement([
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
                        proficiency: faker_1.faker.number.int({ min: 5, max: 10 }),
                        createdAt: faker_1.faker.date.recent(),
                    }); }),
                    languages: Array.from({
                        length: faker_1.faker.number.int({ min: 1, max: 3 }),
                    }).map(function () { return ({
                        language: faker_1.faker.helpers.arrayElement([
                            "English",
                            "Spanish",
                            "French",
                            "German",
                            "Chinese",
                            "Japanese",
                        ]),
                        proficiency: faker_1.faker.number.int({ min: 5, max: 10 }),
                        createdAt: faker_1.faker.date.recent(),
                    }); }),
                    subjects: Array.from({
                        length: faker_1.faker.number.int({ min: 2, max: 5 }),
                    }).map(function () { return ({
                        subject: faker_1.faker.helpers.arrayElement([
                            "Database Systems",
                            "Artificial Intelligence",
                            "Computer Networks",
                            "Data Structures",
                        ]),
                        proficiency: faker_1.faker.number.int({ min: 5, max: 10 }),
                        createdAt: faker_1.faker.date.recent(),
                    }); }),
                    projects: Array.from({
                        length: faker_1.faker.number.int({ min: 1, max: 3 }),
                    }).map(function () {
                        var startDate = faker_1.faker.date.past({ years: 2 });
                        var endDate = faker_1.faker.datatype.boolean()
                            ? faker_1.faker.date.between({ from: startDate, to: new Date() })
                            : null;
                        return {
                            title: faker_1.faker.helpers.arrayElement([
                                "Smart Home Automation System",
                                "Machine Learning Stock Predictor",
                                "E-commerce Platform",
                                "Social Media Dashboard",
                                "Personal Finance Tracker",
                            ]),
                            domain: faker_1.faker.helpers.arrayElement([
                                "Web Development",
                                "Mobile Development",
                                "Machine Learning",
                                "IoT",
                                "Cloud Computing",
                            ]),
                            startDate: startDate,
                            endDate: endDate,
                            current: endDate === null,
                            associatedWith: faker_1.faker.helpers.arrayElement([
                                "personal",
                                "academic",
                                "professional",
                            ]),
                            description: faker_1.faker.lorem.paragraph(),
                            url: faker_1.faker.internet.url(),
                            createdAt: faker_1.faker.date.recent(),
                        };
                    }),
                    certificates: Array.from({
                        length: faker_1.faker.number.int({ min: 0, max: 2 }),
                    }).map(function () {
                        var issueDate = faker_1.faker.date.past({ years: 2 });
                        var doesExpire = faker_1.faker.datatype.boolean();
                        var hasScore = faker_1.faker.datatype.boolean();
                        return {
                            title: faker_1.faker.helpers.arrayElement([
                                "AWS Certified Solutions Architect",
                                "Google Cloud Professional",
                                "Microsoft Certified: Azure Developer",
                                "Certified Data Scientist",
                                "Full Stack Web Development",
                            ]),
                            issuer: faker_1.faker.company.name(),
                            url: faker_1.faker.internet.url(),
                            licenseNumber: faker_1.faker.datatype.boolean()
                                ? faker_1.faker.string.alphanumeric(10)
                                : null,
                            issueDate: issueDate,
                            doesExpire: doesExpire,
                            expiryDate: doesExpire
                                ? faker_1.faker.date.future({ years: 3, refDate: issueDate })
                                : null,
                            hasScore: hasScore,
                            score: hasScore ? faker_1.faker.number.int({ min: 700, max: 990 }) : null,
                            description: faker_1.faker.lorem.sentence(),
                            createdAt: faker_1.faker.date.recent(),
                        };
                    }),
                    resumeUrl: faker_1.faker.internet.url(),
                    institute: instituteId,
                    instituteUid: faker_1.faker.string.alphanumeric(10),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                return [4 /*yield*/, newCandidate.save()];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10:
                _a++;
                return [3 /*break*/, 7];
            case 11: return [4 /*yield*/, Institute_1.default.updateOne({ _id: instituteId }, {
                    $push: {
                        auditLogs: {
                            action: "Added ".concat(CANDIDATES_LIMIT, " sample candidates"),
                            user: "System",
                            userId: "system",
                            type: "info",
                        },
                    },
                })];
            case 12:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
generateSampleInstituteCandidates("67f23bc672617f99ac1c227b");
exports.default = generateSampleInstituteData;
