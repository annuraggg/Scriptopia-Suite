import Problem from "@/models/Problem";
import { CodeAssessment } from "@shared-types/CodeAssessment";
import { ProblemSubmissionSchema } from "@shared-types/CodeAssessmentSubmission";

const getCodeScore = async (
  problemSubmissions: ProblemSubmissionSchema[],
  assessment: CodeAssessment
) => {
  let total = 0;
  let problem: { problemId: string; obtainedMarks: number }[] = [];

  // Skip if no grading schema is defined
  if (!assessment.grading) return { problem, total };

  for (const submission of problemSubmissions) {
    let grade = 0;
    const problemId = submission.problemId.toString();

    // Find the problem in the assessment
    const problemExists = assessment.problems.some(
      (p: any) => p.toString() === problemId
    );
    if (!problemExists) continue;

    if (assessment.grading.type === "testcase") {
      // Skip if testcase grading configuration is missing
      if (!assessment.grading.testcases) continue;

      // Fetch the problem to get testcase details
      const problemDoc = await Problem.findById(problemId);
      if (!problemDoc) continue;

      // Calculate score based on testcase difficulty
      for (const testCase of problemDoc.testCases) {
        if (!testCase?._id?.toString()) continue;

        const passed = submission.results.find(
          (result) =>
            result.caseId === testCase?._id?.toString() &&
            result.passed &&
            !result.isSample // Exclude sample test cases from scoring
        );

        if (!passed) continue;

        switch (testCase.difficulty) {
          case "easy":
            grade += assessment.grading.testcases.easy;
            break;
          case "medium":
            grade += assessment.grading.testcases.medium;
            break;
          case "hard":
            grade += assessment.grading.testcases.hard;
            break;
        }
      }
    }

    if (assessment?.grading?.type && assessment.grading.type === "problem") {
      const gradingProblemObj = assessment?.grading?.problem?.find(
        (p: any) => p.problemId?.toString() === problemId
      );

      if (!gradingProblemObj) continue;

      // Check if all non-sample test cases passed
      const nonSampleResults = submission.results.filter(
        (result) => !result.isSample
      );

      const allPassed =
        nonSampleResults.length > 0 &&
        nonSampleResults.every((result) => result.passed);

      if (allPassed) {
        grade = gradingProblemObj.points;
      }
    }

    problem.push({
      problemId,
      obtainedMarks: grade,
    });

    total += grade;
  }

  return {
    problem,
    total,
  };
};

export default getCodeScore;
