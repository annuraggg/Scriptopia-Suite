import { CodeAssessment } from "./CodeAssessment";
import { CodeAssessmentSubmission } from "./CodeAssessmentSubmission";

interface ExtendedCodeAssessmentSubmission
  extends Omit<CodeAssessmentSubmission, "assessmentId"> {
  assessmentId: CodeAssessment;
}

export type { ExtendedCodeAssessmentSubmission };
