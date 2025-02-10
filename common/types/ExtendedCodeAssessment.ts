import { CodeAssessment } from "./CodeAssessment";
import { Problem } from "./Problem";

interface ExtendedCodeAssessment extends Omit<CodeAssessment, "problems"> {
  problems: Problem[];
}

export type { ExtendedCodeAssessment };
