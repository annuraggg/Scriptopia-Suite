import {
  CodeAssessmentSubmission,
  ProblemSubmission,
} from "./CodeAssessmentSubmission";
import { ExtendedCodeAssessment } from "./ExtendedCodeAssessment";
import { Problem } from "./Problem";

interface ExtendedCodeAssessmentSubmission
  extends Omit<CodeAssessmentSubmission, "assessmentId" | "submissions"> {
  assessmentId: ExtendedCodeAssessment;
  submissions: ExtendedSubmission[];
}

interface ExtendedSubmission extends Omit<ProblemSubmission, "problemId"> {
  problemId: Problem;
}

export type { ExtendedCodeAssessmentSubmission };
