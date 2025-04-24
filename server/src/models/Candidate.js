"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var softDelete_1 = require("@/plugins/softDelete");
var mongoose_1 = require("mongoose");
var mongoose_2 = require("mongoose");
var socialLinkSchema = new mongoose_2.Schema({
    platform: {
        type: String,
        required: true,
        enum: [
            "linkedin",
            "github",
            "twitter",
            "facebook",
            "instagram",
            "portfolio",
            "other",
        ],
    },
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var educationSchema = new mongoose_2.Schema({
    school: { type: String, required: true },
    degree: { type: String, required: true },
    board: { type: String, required: true },
    branch: { type: String, required: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: false },
    current: { type: Boolean, required: true },
    type: {
        type: String,
        required: true,
        enum: ["fulltime", "parttime", "distance"],
    },
    percentage: { type: Number, required: true },
    // New fields for backlogs
    activeBacklogs: { type: Number, default: 0 },
    totalBacklogs: { type: Number, default: 0 },
    clearedBacklogs: { type: Number, default: 0 },
    backlogHistory: [
        {
            subject: { type: String, required: true },
            semester: { type: Number, required: true },
            cleared: { type: Boolean, default: false },
            attemptCount: { type: Number, default: 1 },
            clearedDate: { type: Date, required: false },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});
var workSchema = new mongoose_2.Schema({
    company: { type: String, required: true },
    sector: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ["fulltime", "parttime", "internship", "contract", "freelance"],
    },
    jobFunction: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    current: { type: Boolean, required: true },
    description: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});
var skillSchema = new mongoose_2.Schema({
    skill: { type: String, required: true },
    proficiency: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
var languageSchema = new mongoose_2.Schema({
    language: { type: String, required: true },
    proficiency: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
var subjectSchema = new mongoose_2.Schema({
    subject: { type: String, required: true },
    proficiency: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
var responsibilitySchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    organization: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    current: { type: Boolean, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var projectSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    domain: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    current: { type: Boolean, required: true },
    associatedWith: {
        type: String,
        required: true,
        enum: ["personal", "academic", "professional"],
    },
    description: { type: String, required: true },
    url: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});
var awardSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    associatedWith: {
        type: String,
        required: true,
        enum: ["personal", "academic", "professional"],
    },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var certificateSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    url: { type: String, required: false },
    licenseNumber: { type: String, required: false },
    issueDate: { type: Date, required: true },
    doesExpire: { type: Boolean, required: true },
    expiryDate: { type: Date, required: false },
    hasScore: { type: Boolean, required: true },
    score: { type: Number, required: false },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var competitionSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    position: { type: String, required: true },
    organizer: { type: String, required: true },
    associatedWith: {
        type: String,
        required: true,
        enum: ["personal", "academic", "professional"],
    },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var conferenceSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    organizer: { type: String, required: true },
    eventLocation: { type: String, required: true },
    eventDate: { type: Date, required: true },
    link: { type: String, required: false },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var patentSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    patentOffice: { type: String, required: true },
    patentNumber: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["pending", "granted", "rejected"],
    },
    filingDate: { type: Date, required: true },
    issueDate: { type: Date, required: false },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var scholarshipSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    organization: { type: String, required: true },
    grantDate: { type: Date, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var volunteerSchema = new mongoose_2.Schema({
    organization: { type: String, required: true },
    role: { type: String, required: true },
    cause: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    current: { type: Boolean, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var extraCurricularSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    current: { type: Boolean, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var notificationSchema = new mongoose_2.Schema({
    message: { type: String, required: true },
    type: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
var candidateSchema = new mongoose_2.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    // Optional profile fields
    summary: { type: String, required: false },
    profileImage: { type: String, required: false },
    // Academic aggregates for quick filtering
    academicAggregates: {
        overallCGPA: { type: Number, required: false },
        hasBacklogs: { type: Boolean, default: false },
        activeBacklogs: { type: Number, default: 0 },
        totalBacklogs: { type: Number, default: 0 },
    },
    socialLinks: { type: [socialLinkSchema], required: false },
    education: { type: [educationSchema], required: false },
    workExperience: { type: [workSchema], required: false },
    technicalSkills: { type: [skillSchema], required: false },
    languages: { type: [languageSchema], required: false },
    subjects: { type: [subjectSchema], required: false },
    responsibilities: { type: [responsibilitySchema], required: false },
    projects: { type: [projectSchema], required: false },
    awards: { type: [awardSchema], required: false },
    certificates: { type: [certificateSchema], required: false },
    competitions: { type: [competitionSchema], required: false },
    conferences: { type: [conferenceSchema], required: false },
    patents: { type: [patentSchema], required: false },
    scholarships: { type: [scholarshipSchema], required: false },
    volunteerings: { type: [volunteerSchema], required: false },
    extraCurriculars: { type: [extraCurricularSchema], required: false },
    resumeUrl: { type: String, required: false },
    resumeExtract: { type: String },
    appliedPostings: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "AppliedPosting" },
    ],
    appliedDrives: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "AppliedDrive" },
    ],
    notifications: [notificationSchema],
    institute: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Institute" },
    instituteUid: { type: String, required: false },
    instituteDepartment: { type: String, required: false },
    // Profile completion metadata
    profileCompletionPercentage: { type: Number, default: 0 },
    lastProfileUpdate: { type: Date, default: Date.now },
}, { timestamps: true });
candidateSchema.index({ email: 1 });
candidateSchema.index({ userId: 1 });
candidateSchema.index({ "appliedPostings.postingId": 1 });
candidateSchema.index({ "appliedDrives.driveId": 1 });
candidateSchema.index({ instituteUid: 1 });
candidateSchema.index({ institute: 1 });
candidateSchema.index({ "academicAggregates.hasBacklogs": 1 });
candidateSchema.index({ "academicAggregates.activeBacklogs": 1 });
candidateSchema.plugin(softDelete_1.softDeletePlugin);
var Candidate = mongoose_1.default.model("Candidate", candidateSchema);
exports.default = Candidate;
