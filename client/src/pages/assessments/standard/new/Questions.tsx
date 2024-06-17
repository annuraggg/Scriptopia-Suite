import { Button, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    id: 1,
    name: "Two Sum",
    author: "@kylelobo",
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to a specific target. Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    tags: ["Array", "Dynamic Programming", "Binary Search", "Hash Table"],
  },
  {
    id: 2,
    name: "Longest Common Prefix",
    author: "@kylelobo",
    description:
      "Write a function to find the longest common prefix string amongst an array of strings.",
    tags: ["String", "Dynamic Programming", "Hash Table"],
  },
  {
    id: 3,
    name: "Longest Increasing Subsequence",
    author: "@kylelobo",
    description:
      "Given an unsorted array of integers, find the length of the longest increasing subsequence.",
    tags: ["Array", "Dynamic Programming", "Hash Table"],
  },
  {
    id: 4,
    name: "Longest Substring Without Repeating Characters",
    author: "@kylelobo",
    description:
      "Given a string, find the length of the longest substring without repeating characters.",
    tags: ["String", "Dynamic Programming", "Hash Table"],
  },
  {
    id: 5,
    name: "Valid Sudoku",
    author: "@kylelobo",
    description:
      "Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules: Each row must contain the digits 1-9 without repetition. Each column must contain the digits 1-9 without repetition. Each of the nine 3x3 sub-boxes of the grid must contain the digits 1-9 without repetition.",
    tags: ["Array", "Dynamic Programming", "Hash Table"],
  },
  {
    id: 6,
    name: "Valid Parentheses",
    author: "@kylelobo",
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    tags: ["String", "Dynamic Programming", "Hash Table"],
  },
];

const Questions = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [availableQuestions, setAvailableQuestions] =
    useState<typeof questions>(questions);
  const [selectedQuestions, setSelectedQuestions] = useState<typeof questions>(
    []
  );

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...selectedQuestions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newQuestions.length) {
      const temp = newQuestions[targetIndex];
      newQuestions[targetIndex] = newQuestions[index];
      newQuestions[index] = temp;
      setSelectedQuestions(newQuestions);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button onClick={() => setSheetOpen(true)} variant="flat">
          Add Question
        </Button>
      </motion.div>

      <div className="flex flex-col gap-4 mt-5">
        <AnimatePresence>
          {selectedQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>{question.name}</CardHeader>
                <CardBody>
                  <div className="flex gap-5 items-center">
                    <div className="min-w-12 min-h-12 rounded-full flex items-center justify-center border text-center">
                      {index + 1}
                    </div>
                    <div className="w-full">
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {question.description}
                      </p>
                      <div className="flex gap-2 flex-wrap mt-5 text-xs line-clamp-1 text-ellipsis h-7">
                        {question.tags.map((tag) => (
                          <Chip key={tag} className="text-xs" size="sm">
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          onClick={() => moveQuestion(index, "up")}
                        >
                          <ChevronUpIcon />
                        </Button>
                        <Button
                          isIconOnly
                          onClick={() => moveQuestion(index, "down")}
                        >
                          <ChevronDownIcon />
                        </Button>
                      </div>
                      <Button
                        className="mt-2 w-full"
                        color="danger"
                        variant="flat"
                        onClick={() => {
                          setSelectedQuestions((prev) =>
                            prev.filter((q) => q.id !== question.id)
                          );
                          setAvailableQuestions((prev) =>
                            prev.concat(question)
                          );
                          setSheetOpen(false);
                        }}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="min-w-[500px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Select a Question</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-5">
            {availableQuestions.map((question) => (
              <Card key={question.id} className="w-full">
                <CardHeader>{question.name}</CardHeader>
                <CardBody>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {question.description}
                  </p>
                  <div className="flex gap-2 flex-wrap mt-5 text-xs line-clamp-1 text-ellipsis h-7 justify-center">
                    {question.tags.map((tag) => (
                      <Chip key={tag} className="text-xs" size="sm">
                        {tag}
                      </Chip>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="flat" className="w-full mt-2">
                      View
                    </Button>
                    <Button
                      variant="flat"
                      className="w-full mt-2"
                      color="success"
                      onClick={() => {
                        setSelectedQuestions((prev) => [...prev, question]);
                        setAvailableQuestions((prev) =>
                          prev.filter((q) => q.id !== question.id)
                        );
                        setSheetOpen(false);
                      }}
                    >
                      Add Question
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Questions;
