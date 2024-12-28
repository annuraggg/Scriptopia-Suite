import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  RadioGroup,
  Radio,
  Input,
  Textarea,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@nextui-org/react";

import {
  MCQAssessment as MA,
  Question,
  QuestionType,
} from "@shared-types/MCQAssessment";

interface QuestionCardProps {
  question: Question;
  onAnswerChange: (questionId: number, answer: string | string[]) => void;
  currentAnswer: string | string[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerChange,
  currentAnswer,
}) => {
  const handleAnswerChange = (value: string, id: string) => {};

  const renderQuestion = () => {
    switch (question.type) {
      case "multi-select":
        return (
          <RadioGroup
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(e.target.value, question._id!)}
          >
            {question.options?.map((option, index) => (
              <Radio key={index} value={option.option}>
                {option.option}
              </Radio>
            ))}
          </RadioGroup>
        );

      case "true-false":
        return (
          <RadioGroup
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(e.target.value, question._id!)}
          >
            <Radio value="true">True</Radio>
            <Radio value="false">False</Radio>
          </RadioGroup>
        );

      case "fill-in-blanks":
        return question.fillInBlankAnswers?.map((_, index) => (
          <Input
            key={index}
            placeholder={`Blank ${index + 1}`}
            value={
              Array.isArray(currentAnswer) ? currentAnswer[index] || "" : ""
            }
            onChange={(e) => handleAnswerChange(e.target.value, question._id!)}
            className="mt-2"
          />
        ));

      case "short-answer":
        return (
          <Textarea
            placeholder="Your answer..."
            value={currentAnswer as string}
            minRows={3}
            onChange={(e) => handleAnswerChange(e.target.value, question._id!)}
          />
        );

      case "long-answer":
        return (
          <Textarea
            placeholder="Your detailed answer..."
            value={currentAnswer as string}
            minRows={6}
            onChange={(e) => handleAnswerChange(e.target.value, question._id!)}
          />
        );

      case "matching":
        return question?.options?.map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Select
              placeholder="Select"
              value={
                Array.isArray(currentAnswer)
                  ? currentAnswer[index] || ""
                  : undefined
              }
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
            >
              {question?.options!.map((opt, i) => (
                <SelectItem key={i} value={opt.option}>
                  {opt.option}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Select"
              value={
                Array.isArray(currentAnswer)
                  ? currentAnswer[index] || ""
                  : undefined
              }
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
            >
              {question?.options!.map((opt, i) => (
                <SelectItem key={i} value={opt.matchingPairText}>
                  {opt.matchingPairText}
                </SelectItem>
              ))}
            </Select>
          </div>
        ));

      case "single-select":
        return (
          <RadioGroup
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(e.target.value, question._id!)}
          >
            {question.options?.map((option, index) => (
              <Radio key={index} value={option.option}>
                {option.option}
              </Radio>
            ))}
          </RadioGroup>
        );

      case "peer-review":
        return (
          <div>
            <Textarea
              placeholder="Your answer..."
              value={currentAnswer as string}
              minRows={4}
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
            />
            <Input
              placeholder="Enter the email of the peer reviewer"
              className="mt-4"
            />
          </div>
        );

      case "visual":
        return (
          <div>
            <img src={question.imageSource} alt="Visual question" />
          </div>
        );

      case "output":
        return (
          <div>
            <div className="px-5">
              <pre className="whitespace-pre-wrap text-sm">
                {question.codeSnippet}
              </pre>
            </div>
            <RadioGroup
              value={currentAnswer as string}
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
              className="mt-5"
            >
              {question.options?.map((option, index) => (
                <Radio key={index} value={option.option}>
                  {option.option}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return (
          <Textarea
            placeholder="Your answer..."
            value={currentAnswer as string}
            minRows={4}
            onChange={(e) => handleAnswerChange(e.target.value, question._id!)}
          />
        );
    }
  };

  const normalizeType = (type: string) => {
    switch (type as QuestionType) {
      case "multi-select":
        return "Multiple Choice";
      case "true-false":
        return "True/False";
      case "fill-in-blanks":
        return "Fill in the Blanks";
      case "short-answer":
        return "Short Answer";
      case "long-answer":
        return "Long Answer";
      case "matching":
        return "Matching";
      case "peer-review":
        return "Peer Review";
      case "output":
        return "Output Prediction";
      case "visual":
        return "Visual";
      case "single-select":
        return "Single Select";
      default:
        return type;
    }
  };

  return (
    <Card className="w-full mb-4 p-5">
      <CardHeader className="flex-col justify-start items-start">
        <div className="text-xs text-default-500 flex justify-between w-full pr-5 mb-3">
          <p>{normalizeType(question.type)}</p>
          <p>{question.grade} points</p>
        </div>
        <div>{question.question}</div>
      </CardHeader>
      <CardBody>{renderQuestion()}</CardBody>
    </Card>
  );
};

interface SectionsProps {
  assessment: MA;
  currentSection: number;
}

const Sections = ({ assessment, currentSection }: SectionsProps) => {
  const [questions] = useState<Question[]>(
    assessment?.sections[currentSection]?.questions || []
  );
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  const handleAnswerChange = (
    questionId: number,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // @ts-ignore - Optional: Function to get all answers for submission
  const getAllAnswers = () => {
    return answers;
  };

  return (
    <div className="w-full overflow-y-auto">
      <div className="p-4">
        <Tabs aria-label="Question types">
          <Tab key="all" title="All Questions">
            <div className="space-y-4 mt-4">
              {assessment?.sections[currentSection]?.questions?.map(
                (question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    onAnswerChange={handleAnswerChange}
                    currentAnswer={
                      // @ts-ignore
                      answers[question?._id] ||
                      (question.type === "fill-in-blanks" ||
                      question.type === "matching"
                        ? []
                        : "")
                    }
                  />
                )
              )}
            </div>
          </Tab>
          <Tab key="mcq" title="MCQ">
            <div className="space-y-4 mt-4">
              {questions
                .filter(
                  (q) => q.type === "multi-select" || q.type === "true-false"
                )
                .map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    onAnswerChange={handleAnswerChange} // @ts-expect-error
                    currentAnswer={answers[question._id] || ""}
                  />
                ))}
            </div>
          </Tab>
          <Tab key="code" title="Coding">
            <div className="space-y-4 mt-4">
              {questions
                .filter((q) => q.type === "peer-review" || q.type === "output")
                .map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    onAnswerChange={handleAnswerChange} // @ts-expect-error
                    currentAnswer={answers[question._id] || ""}
                  />
                ))}
            </div>
          </Tab>
          <Tab key="written" title="Written">
            <div className="space-y-4 mt-4">
              {questions
                .filter((q) =>
                  [
                    "short-answer",
                    "long-answer",
                    "case-study",
                    "scenario",
                  ].includes(q.type)
                )
                .map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    onAnswerChange={handleAnswerChange} // @ts-expect-error
                    currentAnswer={answers[question._id] || ""}
                  />
                ))}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Sections;
