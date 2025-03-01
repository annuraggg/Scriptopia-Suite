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
} from "@heroui/react";

import {
  MCQAssessment as MA,
  Question,
  QuestionType,
} from "@shared-types/MCQAssessment";
import { MCQAssessmentSubmission } from "@shared-types/MCQAssessmentSubmission";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { useMemo } from "react";
import { Check } from "lucide-react";

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface QuestionCardProps {
  question: Question;
  currentAnswer: string | string[];
  assessmentSub: MCQAssessmentSubmission;
  setAssessmentSub: (assessmentSub: MCQAssessmentSubmission) => void;
  shuffleOptions?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  assessmentSub,
  setAssessmentSub,
  shuffleOptions = true,
}) => {
  // Create shuffled options for question types that have options
  const shuffledOptions = useMemo(() => {
    if (
      !shuffleOptions ||
      !question.options ||
      question.type === "matching" || // Don't shuffle matching type
      question.options.length === 0
    ) {
      return question.options || [];
    }

    return shuffleArray(question.options);
  }, [question.options, question.type, shuffleOptions]);

  // For matching questions, shuffle only the right column options (matchingPairText)
  const shuffledMatchingOptions = useMemo(() => {
    if (
      !shuffleOptions ||
      !question.options ||
      question.type !== "matching" ||
      question.options.length === 0
    ) {
      return question.options || [];
    }

    // Create a shuffled array of just the matchingPairText values
    const matchingPairs = question.options.map((opt) => opt.matchingPairText);
    const shuffledPairs = shuffleArray(matchingPairs);

    // Create new options with original left column and shuffled right column
    return question.options.map((opt, idx) => ({
      ...opt,
      matchingPairText: shuffledPairs[idx],
    }));
  }, [question.options, question.type, shuffleOptions]);

  const handleAnswerChange = (
    value: string | string[],
    id: string,
    blankIndex?: number
  ) => {
    console.log(value, id, blankIndex);
    const submissions = assessmentSub?.mcqSubmissions || [];
    const index = submissions.findIndex((sub) => sub.mcqId === id);

    // check if the question is fill-in-blanks
    if (question.type === "fill-in-blanks") {
      if (blankIndex === undefined) return;
      if (Array.isArray(value)) return;

      if (index === -1) {
        submissions.push({
          mcqId: id,
          selectedOptions: [value],
        });
      }

      const newIndex = index === -1 ? submissions.length - 1 : index;

      submissions[newIndex].selectedOptions[blankIndex] = value;
      setAssessmentSub({ ...assessmentSub, mcqSubmissions: submissions });

      return;
    }

    if (question.type === "matching") {
      if (Array.isArray(value)) return;
      if (blankIndex === undefined) return;

      if (index === -1) {
        submissions.push({
          mcqId: id,
          selectedOptions: [value],
        });
      }

      const newIndex = index === -1 ? submissions.length - 1 : index;

      let sub = submissions[newIndex]?.selectedOptions
        ? submissions[newIndex].selectedOptions
        : [];

      sub[blankIndex] = value;
      setAssessmentSub({ ...assessmentSub, mcqSubmissions: submissions });

      return;
    }

    if (index === -1) {
      submissions.push({
        mcqId: id,
        selectedOptions: typeof value === "string" ? [value] : value,
      });
    } else {
      submissions[index].selectedOptions =
        typeof value === "string" ? [value] : value;
    }

    setAssessmentSub({ ...assessmentSub, mcqSubmissions: submissions });
  };

  const getRemainingCharacters = (value: string, max: number) => {
    return max - value.length;
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "multi-select":
        return (
          <CheckboxGroup
            label="Answer"
            value={currentAnswer as string[]}
            onValueChange={(e) => handleAnswerChange(e, question._id!)}
          >
            {shuffledOptions.map((option, index) => (
              <Checkbox key={index} value={option.option}>
                {option.option}
              </Checkbox>
            ))}
          </CheckboxGroup>
        );

      case "true-false":
        return (
          <RadioGroup
            label="Answer"
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
            value={currentAnswer[index]}
            label="Answer"
            onChange={(e) =>
              handleAnswerChange(e.target.value, question._id!, index)
            }
            className="mt-2"
          />
        ));

      case "short-answer":
        return (
          <>
            <Textarea
              placeholder="Your answer..."
              value={currentAnswer as string}
              label="Answer"
              minRows={3}
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
              maxLength={question?.maxCharactersAllowed || 100}
            />
            <p
              className={`text-xs text-default-500 mt-3 
            ${
              getRemainingCharacters(
                currentAnswer as string,
                question?.maxCharactersAllowed || 100
              ) <= 0
                ? "text-red-500"
                : "text-default-500"
            }
              `}
            >
              {getRemainingCharacters(
                currentAnswer as string,
                question?.maxCharactersAllowed || 100
              )}{" "}
              characters remaining
            </p>
          </>
        );

      case "long-answer":
        return (
          <>
            <Textarea
              placeholder="Your detailed answer..."
              value={currentAnswer as string}
              label="Answer"
              minRows={6}
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
              maxLength={question?.maxCharactersAllowed || 500}
            />

            <p
              className={`text-xs text-default-500 mt-3
                    ${
                      getRemainingCharacters(
                        currentAnswer as string,
                        question?.maxCharactersAllowed || 100
                      ) <= 0
                        ? "text-red-500"
                        : "text-default-500"
                    }
              `}
            >
              {getRemainingCharacters(
                currentAnswer as string,
                question?.maxCharactersAllowed || 500
              )}{" "}
              characters remaining
            </p>
          </>
        );

      case "matching":
        return question?.options?.map((_, index) => (
          <div key={index} className="flex items-center space-x-4 mt-2">
            <div className="w-[30%]">{question.options![index].option}</div>
            <Select
              placeholder="Select"
              className="w-[30%]"
              label="Answer"
              selectedKeys={[currentAnswer[index]]}
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!, index)
              }
            >
              {shuffledMatchingOptions.map((opt) => (
                <SelectItem key={opt.matchingPairText!}>
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
            label="Answer"
          >
            {shuffledOptions.map((option, index) => (
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
              label="Answer"
              minRows={4}
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
            />
          </div>
        );

      case "visual":
        return (
          <div>
            <img
              src={question.imageSource}
              alt="Visual question"
              className="w-full max-h-[300px] object-scale-down"
            />
            <Textarea
              className="mt-4"
              label="Answer"
              placeholder="Your answer..."
              value={currentAnswer as string}
              minRows={4}
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
            />
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
            <Textarea
              className="mt-4"
              placeholder="Your answer..."
              value={currentAnswer as string}
              label="Answer"
              minRows={4}
              onChange={(e) =>
                handleAnswerChange(e.target.value, question._id!)
              }
            />
          </div>
        );

      default:
        return (
          <Textarea
            placeholder="Your answer..."
            value={currentAnswer as string}
            label="Answer"
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
    <Card
      className={`w-full mb-4 p-5 shadow-none ${
        (typeof currentAnswer === "string" && currentAnswer) ||
        (Array.isArray(currentAnswer) && currentAnswer.length > 0)
          ? "bg-success/10"
          : ""
      }`}
    >
      <CardHeader className="flex-col justify-start items-start">
        <div className="text-xs text-default-500 flex justify-between w-full pr-5 mb-3">
          <p>{normalizeType(question.type)}</p>
          <p>{question.grade} points</p>
        </div>
        <div className="flex items-center gap-2">
          {(typeof currentAnswer === "string" && currentAnswer) ||
          (Array.isArray(currentAnswer) && currentAnswer.length > 0)
            ? <Check size={24} className="text-success bg-success/20 rounded-full p-1" />
            : ""}
          <div>{question.question}</div>
        </div>
      </CardHeader>
      <CardBody>{renderQuestion()}</CardBody>
    </Card>
  );
};

interface SectionsProps {
  assessment: MA;
  currentSection: number;
  assessmentSub: MCQAssessmentSubmission;
  setAssessmentSub: (assessmentSub: MCQAssessmentSubmission) => void;
  shuffleOptions?: boolean;
}

const Sections = ({
  assessment,
  currentSection,
  assessmentSub,
  setAssessmentSub,
  shuffleOptions = true,
}: SectionsProps) => {
  const getCurrentAnswer = (question: Question) => {
    const sub = assessmentSub?.mcqSubmissions?.find(
      (sub) => sub.mcqId.toString() === question._id?.toString()
    );

    if (question.type === "fill-in-blanks") return sub?.selectedOptions || "";
    if (question.type === "matching") return sub?.selectedOptions || "";
    if (question.type === "multi-select") return sub?.selectedOptions || [];
    else return sub?.selectedOptions?.[0] || "";
  };

  return (
    <div className="w-full overflow-y-auto h-[94vh]">
      <div>
        <div className="space-y-4">
          {assessment?.sections[currentSection]?.questions?.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              assessmentSub={assessmentSub}
              setAssessmentSub={setAssessmentSub}
              currentAnswer={getCurrentAnswer(question)}
              shuffleOptions={shuffleOptions}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sections;
