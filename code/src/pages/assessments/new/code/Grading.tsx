import { Input, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";
import { Problem } from "@shared-types/Problem";
import {
  Problem as ProblemAssessment,
  Testcases,
} from "@shared-types/CodeAssessment";

interface GradingProps {
  gradingMetric: string;
  setGradingMetric: (gradingMetric: string) => void;
  selectedQuestions: Problem[];
  testCaseGrading: Testcases;
  setTestCaseGrading: (testCaseGrading: Testcases) => void;
  questionsGrading: ProblemAssessment[];
  setQuestionsGrading: (
    questionsGrading:
      | ProblemAssessment[]
      | ((prev: ProblemAssessment[]) => ProblemAssessment[])
  ) => void;
}

const Grading: React.FC<GradingProps> = ({
  gradingMetric,
  setGradingMetric,
  selectedQuestions,
  testCaseGrading,
  setTestCaseGrading,
  questionsGrading,
  setQuestionsGrading,
}) => {
  if (selectedQuestions.length === 0) return "No Problems Selected";

  const isTestCaseGradingValid = () => {
    return testCaseGrading.easy > 0 && testCaseGrading.medium > 0 && testCaseGrading.hard > 0;
  };

  const isQuestionGradingValid = () => {
    return questionsGrading.length === selectedQuestions.length && 
           questionsGrading.every(q => q.points > 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4>Grading Metrics</h4>
      <Select
        label="Grading Metric"
        size="sm"
        className="w-[400px] mt-5"
        selectedKeys={[gradingMetric]}
        onChange={(e) => setGradingMetric(e.target.value)}
      >
        <SelectItem key="testcase">
          By Test Case Difficulty
        </SelectItem>
        <SelectItem key="questions">
          By Questions
        </SelectItem>
      </Select>

      <div className="mt-5">
        {gradingMetric === "testcase" && (
          <div>
            <p className="text-sm text-gray-400 mb-16">
              Evaluate Candidates based on how many test cases they pass and how
              difficult each test case is.
            </p>

            <Input
              type="number"
              label="Score for Easy Test Cases"
              className="w-[200px] mb-10"
              endContent={<div>pts.</div>}
              labelPlacement="outside"
              placeholder="score"
              value={testCaseGrading?.easy?.toString()}
              onChange={(e) =>
                setTestCaseGrading({
                  ...testCaseGrading,
                  easy: parseInt(e?.target?.value),
                })
              }
              isInvalid={testCaseGrading.easy <= 0}
              errorMessage={testCaseGrading.easy <= 0 ? "Score must be greater than 0" : ""}
            />
            <Input
              type="number"
              label="Score for Medium Test Cases"
              className="w-[200px] mb-10"
              endContent={<div>pts.</div>}
              labelPlacement="outside"
              placeholder="score"
              value={testCaseGrading?.medium?.toString()}
              onChange={(e) =>
                setTestCaseGrading({
                  ...testCaseGrading,
                  medium: parseInt(e.target.value),
                })
              }
              isInvalid={testCaseGrading.medium <= 0}
              errorMessage={testCaseGrading.medium <= 0 ? "Score must be greater than 0" : ""}
            />
            <Input
              type="number"
              label="Score for Hard Test Cases"
              className="w-[200px]"
              endContent={<div>pts.</div>}
              labelPlacement="outside"
              placeholder="score"
              value={testCaseGrading?.hard?.toString()}
              onChange={(e) =>
                setTestCaseGrading({
                  ...testCaseGrading,
                  hard: parseInt(e.target.value),
                })
              }
              isInvalid={testCaseGrading.hard <= 0}
              errorMessage={testCaseGrading.hard <= 0 ? "Score must be greater than 0" : ""}
            />
            {!isTestCaseGradingValid() && (
              <p className="text-red-500 mt-4">Please enter valid scores for all test case difficulties</p>
            )}
          </div>
        )}

        {gradingMetric === "questions" && (
          <div>
            <p className="text-sm text-gray-400 mb-5">
              Evaluate Candidates based on the number of questions they answer.
            </p>
            <div className="flex gap-5 flex-wrap items-center">
              {selectedQuestions.map((question) => (
                <div key={question._id} className="w-[200px]">
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {question.title}
                  </p>
                  <Input
                    type="number"
                    label="Score"
                    className="w-[200px] mb-10 pt-2"
                    endContent={<div>pts.</div>}
                    labelPlacement="outside"
                    placeholder="score"
                    value={questionsGrading
                      .find((q) => q.problemId === question._id)
                      ?.points?.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setQuestionsGrading((prev) => {
                        const exists = prev.find(
                          (q) => q.problemId === question._id
                        );
                        if (exists) {
                          return prev.map((q) =>
                            q.problemId === question._id
                              ? { ...q, points: value }
                              : q
                          );
                        }
                        return [
                          ...prev,
                          {
                            problemId: question._id ?? "",
                            points: value,
                          },
                        ];
                      });
                    }}
                    isInvalid={!questionsGrading.find((q) => q.problemId === question._id)?.points || 
                               (questionsGrading.find((q) => q.problemId === question._id)?.points ?? 0) <= 0}
                    errorMessage={!questionsGrading.find((q) => q.problemId === question._id)?.points || 
                                  (questionsGrading.find((q) => q.problemId === question._id)?.points ?? 0) <= 0
                                  ? "Score must be greater than 0" : ""}
                  />
                </div>
              ))}
            </div>
            {!isQuestionGradingValid() && (
              <p className="text-red-500 mt-4">Please enter valid scores for all questions</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Grading;