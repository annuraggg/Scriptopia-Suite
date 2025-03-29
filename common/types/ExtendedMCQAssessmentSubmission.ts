import { MCQAssessment } from "./MCQAssessment";
import { MCQAssessmentSubmission } from "./MCQAssessmentSubmission";

interface ExtendedMCQAssessmentSubmission
  extends Omit<MCQAssessmentSubmission, "assessmentId"> {
  assessmentId: MCQAssessment;
}

export type { ExtendedMCQAssessmentSubmission };
