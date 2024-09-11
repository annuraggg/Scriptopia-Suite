import "dotenv/config";
import mongoose from "mongoose";
import Candidate from "./Candidate.js";
import Posting from "./Posting.js";

export const handler = async (event) => {
  await connectToMongoDB();

  const processingPromises = event.resumes.map((resume) =>
    processResume(resume, event)
  );

  await Promise.all(processingPromises);

  await updatePosting(event.postingId);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
};

const connectToMongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB,
  });
};

const generatePrompt = (event) => `
  ASSUME YOU ARE A Resume Screener
  Here is a job description (JD):
  ${event.jobDescription}

  Skills required (comma separated):
  ${event.skills}

  Negative Prompts (Things you don't want to see in the resume but are not deal breakers):
  ${event.negativePrompts}

  Positive Prompts (Things you want to see in the resume but are not deal makers):
  ${event.positivePrompts}

  I HAVE THE FOLLOWING CANDIDATE RESUME (The actual resume of the candidate):
  ${event.resume}

  Please account for the following:
  - The match percent should be between 0-100
  - The reason should be a string
  - Account for similar skills (e.g. JavaScript and JS should be considered the same)

  Give the following JSON output. PLEASE GIVE ONLY JSON AND NOTHING ELSE:
  {
    match: the match percent of candidate with JD (between 0-100),
    reason: the reason for the match (string),
  }
`;

const runApiCall = async (model, input, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/2ff2ec5b4b7853ab47fda4fa989403f7/ai/run/${model}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    } catch (e) {
      if (attempt === maxRetries) {
        throw new Error("Maximum retry attempts reached. Request failed.");
      }
      // Optionally add a delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

const updateCandidatePosting = async (candidate, postingId, finalResp) => {
  const posting = candidate.appliedPostings.find(
    (posting) => posting.postingId.toString() === postingId
  );

  if (posting) {
    posting.scores.rs = {
      score: finalResp.match,
      reason: finalResp.reason,
    };
    await candidate.save();
  }
};

const processResume = async (resume, event) => {
  const content = generatePrompt({
    jobDescription: event.jobDescription,
    skills: event.skills,
    negativePrompts: event.negativePrompts,
    positivePrompts: event.positivePrompts,
    resume: resume.resume,
  });

  try {
    const response = await runApiCall("@cf/meta/llama-3-8b-instruct", {
      messages: [{ role: "user", content }],
    });

    const finalResp = JSON.parse(response.result.response);
    const candidate = await Candidate.findById(resume.candidateId);

    await updateCandidatePosting(candidate, event.postingId, finalResp);

    return finalResp;
  } catch (e) {
    throw e;
  }
};

const updatePosting = async (postingId) => {
  await Posting.findByIdAndUpdate(postingId, {
    $set: {
      "ats.status": "finished",
    },
  });
};

// Sample invocation for testing purposes
// handler({
//   jobDescription:
//     "We are looking for a web developer with experience in React and Node.js",
//   skills: "Javascript, React, Node.js",
//   negativePrompts: "What is your experience with Java?",
//   positivePrompts: "What is your experience with React?",
//   postingId: "66d435da4764d4b8cfa9b149",
//   resumes: [
//     {
//       candidateId: "66e1343a0f6734fb03a6accc",
//       resume: "I am a web developer with experience in React and Node.js",
//     },
//   ],
// });
