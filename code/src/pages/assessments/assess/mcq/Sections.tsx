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

interface TestCase {
  input: string;
  output: string;
}

interface Pair {
  item: string;
  match: string;
}

interface Question {
  id: number;
  type: string;
  question: string;
  points: number;
  options?: string[];
  correctAnswer?: string | boolean;
  blanks?: string[];
  expectedLength?: number;
  pairs?: Pair[];
  codeToReview?: string;
  imageUrl?: string;
  template?: string;
  testCases?: TestCase[];
  code?: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswerChange: (questionId: number, answer: string | string[]) => void;
  currentAnswer: string | string[];
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    type: "mcq",
    question: "Which of the following is not a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Number"],
    correctAnswer: "Float",
    points: 5,
  },
  {
    id: 2,
    type: "fill-in-blanks",
    question:
      "In React, we use the _____ hook to manage component state and the _____ hook for side effects.",
    blanks: ["useState", "useEffect"],
    points: 3,
  },
  {
    id: 3,
    type: "true-false",
    question: "JavaScript is a statically typed language.",
    correctAnswer: false,
    points: 2,
  },
  {
    id: 4,
    type: "short-answer",
    question: "What is the difference between let and const in JavaScript?",
    expectedLength: 50,
    points: 5,
  },
  {
    id: 5,
    type: "long-answer",
    question: "Explain the concept of closure in JavaScript with examples.",
    expectedLength: 200,
    points: 10,
  },
  {
    id: 6,
    type: "matching",
    question: "Match the following HTTP status codes with their meanings:",
    pairs: [
      { item: "200", match: "OK" },
      { item: "404", match: "Not Found" },
      { item: "500", match: "Internal Server Error" },
      { item: "301", match: "Moved Permanently" },
    ],
    points: 8,
  },
  {
    id: 7,
    type: "case-study",
    question: `You're building an e-commerce platform and need to implement a shopping cart. 
      The cart should persist across page refreshes, handle multiple items, and calculate totals.
      Describe your implementation approach considering performance and user experience.`,
    expectedLength: 300,
    points: 15,
  },
  {
    id: 8,
    type: "scenario",
    question: `Your web application is experiencing slow load times in production.
      Users report 5+ second delays on the dashboard page. 
      What steps would you take to diagnose and resolve the issue?`,
    expectedLength: 250,
    points: 12,
  },
  {
    id: 9,
    type: "peer-review",
    question:
      "Review the following code snippet and provide feedback on code quality, best practices, and potential improvements:",
    codeToReview: `
      function fetchData() {
        var data = [];
        $.ajax({
          url: '/api/data',
          success: function(response) {
            data = response;
            updateUI();
          },
          error: function(err) {
            console.log('Error:', err);
          }
        });
        return data;
      }`,
    expectedLength: 200,
    points: 10,
  },
  {
    id: 10,
    type: "visual",
    question:
      "What accessibility issues can you identify in this interface design?",
    imageUrl: "/api/placeholder/800/400",
    expectedLength: 150,
    points: 8,
  },
  {
    id: 11,
    type: "code",
    question:
      "Write a function that finds the first non-repeating character in a string:",
    template: `function findFirstNonRepeating(str) {
    // Your code here
  }`,
    testCases: [
      { input: "leetcode", output: "l" },
      { input: "loveleetcode", output: "v" },
    ],
    points: 10,
  },
  {
    id: 12,
    type: "output",
    question: "What will be the output of the following code?",
    code: `
      console.log(typeof typeof 1);
      for(var i = 0; i < 3; i++) {
        setTimeout(() => console.log(i), 0);
      }`,
    options: [
      "string, 0,1,2",
      "string, 3,3,3",
      "number, 0,1,2",
      "number, 3,3,3",
    ],
    correctAnswer: "string, 3,3,3",
    points: 5,
  },
];

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerChange,
  currentAnswer,
}) => {
  const handleAnswerChange = (value: string, index?: number) => {
    if (question.type === "fill-in-blanks") {
      const newAnswers = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
      newAnswers[index || 0] = value;
      onAnswerChange(question.id, newAnswers);
    } else if (question.type === "matching") {
      const newAnswers = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
      newAnswers[index || 0] = value;
      onAnswerChange(question.id, newAnswers);
    } else {
      onAnswerChange(question.id, value);
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "mcq":
        return (
          <RadioGroup
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            {question.options?.map((option, index) => (
              <Radio key={index} value={option}>
                {option}
              </Radio>
            ))}
          </RadioGroup>
        );

      case "true-false":
        return (
          <RadioGroup
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            <Radio value="true">True</Radio>
            <Radio value="false">False</Radio>
          </RadioGroup>
        );

      case "fill-in-blanks":
        return question.blanks?.map((_, index) => (
          <Input
            key={index}
            placeholder={`Blank ${index + 1}`}
            value={
              Array.isArray(currentAnswer) ? currentAnswer[index] || "" : ""
            }
            onChange={(e) => handleAnswerChange(e.target.value, index)}
            className="mt-2"
          />
        ));

      case "short-answer":
        return (
          <Textarea
            placeholder="Your answer..."
            value={currentAnswer as string}
            minRows={3}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );

      case "long-answer":
        return (
          <Textarea
            placeholder="Your detailed answer..."
            value={currentAnswer as string}
            minRows={6}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );

      case "matching":
        return question.pairs?.map((pair, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <span className="w-24">{pair.item}</span>
            <Select
              placeholder="Select match"
              value={Array.isArray(currentAnswer) ? currentAnswer[index] : ""}
              onChange={(e) => handleAnswerChange(e.target.value, index)}
            >
              {(question.pairs || []).map((p, i) => (
                <SelectItem key={i} value={p.match}>
                  {p.match}
                </SelectItem>
              ))}
            </Select>
          </div>
        ));

      case "code":
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Write your code here..."
              className="font-mono"
              minRows={8}
              value={currentAnswer as string}
              defaultValue={question.template}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
            <div className="p-5">
              <h4 className="font-semibold mb-2">Test Cases:</h4>
              {question.testCases?.map((test, index) => (
                <div key={index} className="text-sm">
                  Input: {test.input} → Expected Output: {test.output}
                </div>
              ))}
            </div>
          </div>
        );

      case "peer-review":
      case "visual":
      case "case-study":
      case "scenario":
        return (
          <div className="space-y-4">
            {question.type === "peer-review" && (
              <div className="p-5">
                <pre className="whitespace-pre-wrap text-sm">
                  {question.codeToReview}
                </pre>
              </div>
            )}
            {question.type === "visual" && (
              <img src={question.imageUrl} alt="Visual" className="w-full" />
            )}
            <Textarea
              placeholder="Your answer..."
              value={currentAnswer as string}
              minRows={4}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>
        );

      case "output":
        return (
          <div>
            <div className="px-5">
              <pre className="whitespace-pre-wrap text-sm">{question.code}</pre>
            </div>
            <RadioGroup
              value={currentAnswer as string}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="mt-5"
            >
              {question.options?.map((option, index) => (
                <Radio key={index} value={option}>
                  {option}
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
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );
    }
  };

  const normalizeType = (type: string) => {
    switch (type) {
      case "mcq":
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
      case "code":
        return "Code";
      case "output":
        return "Output Prediction";
      case "visual":
        return "Visual";
      case "case-study":
        return "Case Study";
      case "scenario":
        return "Scenario";
      default:
        return type;
    }
  };

  return (
    <Card className="w-full mb-4 p-5">
      <CardHeader className="flex-col justify-start items-start">
        <div className="text-xs text-default-500 flex justify-between w-full pr-5 mb-3">
          <p>{normalizeType(question.type)}</p>
          <p>{question.points} points</p>
        </div>
        <div>{question.question}</div>
      </CardHeader>
      <CardBody>{renderQuestion()}</CardBody>
    </Card>
  );
};

const Sections = () => {
  const [questions] = useState<Question[]>(sampleQuestions);
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

  // Optional: Function to get all answers for submission
  const getAllAnswers = () => {
    return answers;
  };

  return (
    <div className="w-full overflow-y-auto">
      <div className="p-4">
        <Tabs aria-label="Question types">
          <Tab key="all" title="All Questions">
            <div className="space-y-4 mt-4">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onAnswerChange={handleAnswerChange}
                  currentAnswer={
                    answers[question.id] ||
                    (question.type === "fill-in-blanks" ||
                    question.type === "matching"
                      ? []
                      : "")
                  }
                />
              ))}
            </div>
          </Tab>
          <Tab key="mcq" title="MCQ">
            <div className="space-y-4 mt-4">
              {questions
                .filter((q) => q.type === "mcq" || q.type === "true-false")
                .map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onAnswerChange={handleAnswerChange}
                    currentAnswer={answers[question.id] || ""}
                  />
                ))}
            </div>
          </Tab>
          <Tab key="code" title="Coding">
            <div className="space-y-4 mt-4">
              {questions
                .filter((q) => q.type === "code" || q.type === "output")
                .map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onAnswerChange={handleAnswerChange}
                    currentAnswer={answers[question.id] || ""}
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
                    key={question.id}
                    question={question}
                    onAnswerChange={handleAnswerChange}
                    currentAnswer={answers[question.id] || ""}
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
