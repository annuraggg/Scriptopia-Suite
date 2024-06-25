import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  solvedProblems: {
    type: [{ problemId: mongoose.Types.ObjectId, solvedAt: Date }],
    ref: "Problem",
  },
  streak: { type: [String] },
  achievements: { type: [mongoose.Types.ObjectId], ref: "Achievement" },
  resume: { type: [String] },
  portfolio: {
    education: {
      type: [
        {
          institution: { type: String },
          degree: { type: String },
          fieldOfStudy: { type: String },
          startYear: { type: Number },
          endYear: { type: Number },
          grade: { type: String },
        },
      ],
    },

    experience: {
      type: [
        {
          title: { type: String },
          type: {
            type: String,
            enum: [
              "full-time",
              "part-time",
              "internship",
              "freelance",
              "self-employed",
              "trainee",
            ],
          },
          company: { type: String },
          location: { type: String },
          locationType: { type: String, enum: ["remote", "onsite", "hybrid"] },
          startYear: { type: Number },
          endYear: { type: Number },
          description: { type: String },
        },
      ],
    },

    projects: {
      type: [
        {
          title: { type: String },
          description: { type: String },
          startYear: { type: Number },
          endYear: { type: Number },
          link: { type: String },
        },
      ],
    },

    certifications: {
      type: [
        {
          title: { type: String },
          organization: { type: String },
          issueDate: { type: Date },
          expirationDate: { type: Date },
          credentialId: { type: String },
          credentialUrl: { type: String },
        },
      ],
    },

    skills: {
      type: [String],
    },
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
