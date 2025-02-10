import { MCQAssessment } from "@shared-types/MCQAssessment";
import { McqSubmission } from "@shared-types/MCQAssessmentSubmission";

const calculateMCQScore = (
  mcqSubmissions: McqSubmission[],
  assessment: MCQAssessment
) => {
  let total = 0;
  let mcq: { mcqId: string; obtainedMarks: number }[] = [];

  // Iterate through all sections and their questions
  for (const section of assessment.sections) {
    for (const question of section.questions) {
      const mcqSubmission = mcqSubmissions.find(
        (sub) => sub.mcqId.toString() === question?._id?.toString()
      );

      if (!mcqSubmission) continue;

      let grade = 0;

      switch (question.type) {
        case "single-select":
          // Check if the selected option is correct
          const correctOption = question?.options?.find((opt) => opt.isCorrect);
          if (
            correctOption &&
            mcqSubmission.selectedOptions[0] === correctOption.option
          ) {
            grade = question?.grade || 0;
          }
          break;

        case "multi-select":
          // All correct options must be selected and no incorrect ones
          const correctOptions =
            question?.options
              ?.filter((opt) => opt.isCorrect)
              .map((opt) => opt.option) || [];
          const selectedOptions = mcqSubmission.selectedOptions;

          if (
            correctOptions.length === selectedOptions.length &&
            correctOptions.every((opt) => selectedOptions.includes(opt)) &&
            selectedOptions.every((opt) => correctOptions.includes(opt))
          ) {
            grade = question?.grade || 0;
          }
          break;

        case "true-false":
          // Similar to single-select but simpler
          const correctAnswer = question?.options?.find((opt) => opt.isCorrect);
          if (
            correctAnswer &&
            mcqSubmission.selectedOptions[0].toLowerCase() ===
              correctAnswer.option.toLowerCase()
          ) {
            grade = question?.grade || 0;
          }
          break;

        case "matching":
          // Check if all matching pairs are correct
          const allAnswers = question?.options?.map(
            (opt) => opt.matchingPairText
          );

          const userAnswers = mcqSubmission.selectedOptions;
          const allPairsCorrect = allAnswers?.every(
            (answer, index) => answer === userAnswers[index]
          );

          if (allPairsCorrect) {
            grade = question?.grade || 0;
          }
          break;

        case "fill-in-blanks":
          // Check if all blanks are filled correctly
          if (
            question.fillInBlankAnswers &&
            mcqSubmission.selectedOptions.length ===
              question.fillInBlankAnswers.length
          ) {
            const allCorrect = mcqSubmission.selectedOptions.every(
              (answer, index) =>
                answer.toLowerCase().trim() ===
                question?.fillInBlankAnswers?.[index].toLowerCase().trim()
            );
            if (allCorrect) {
              grade = question?.grade || 0;
            }
          }
          break;

        case "long-answer":
        case "peer-review":
          // These types require manual grading
          grade = 0;
          break;

        case "output":
          // Exact match required
          const correctOutput = question.correct;
          if (
            correctOutput &&
            mcqSubmission.selectedOptions[0].trim() === correctOutput.trim()
          ) {
            grade = question?.grade || 0;
          }
          break;

        case "visual":
          const correct = question.correct;
          const selected = mcqSubmission.selectedOptions[0];
          if (correct === selected) {
            grade = question?.grade || 0;
          }
          break;

        case "short-answer":
          const correctShort = question.correct;
          const selectedAnswer = mcqSubmission.selectedOptions[0];
          if (correctShort === selectedAnswer) {
            grade = question?.grade || 0;
          }

          break;
      }

      mcq.push({
        mcqId: question?._id?.toString() || "",
        obtainedMarks: grade,
      });

      total += grade;
    }
  }

  return {
    mcq,
    total,
  };
};

export default calculateMCQScore;
