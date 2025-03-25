import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

const ConundrumCubes = () => {
  const cubes = [
    {
      name: "Google Interview Cube",
      questions: 3,
      difficulty: "easy",
      tags: ["Array", "Hash Maps"],
      status: "Unsolved",
    },
    {
      name: "Facebook Interview Cube",
      questions: 5,
      difficulty: "medium",
      tags: ["Linked Lists"],
      status: "Solved",
    },
    {
      name: "Amazon Interview Cube",
      questions: 2,
      difficulty: "easy",
      tags: ["Stacks"],
      status: "Solved",
    },
    {
      name: "Microsoft Interview Cube",
      questions: 4,
      difficulty: "medium",
      tags: [
        "Strings",
        "Two Pointers",
        "Two Pointers",
        "Two Pointers",
        "Two Pointers",
      ],
      status: "Solved",
    },
    {
      name: "Apple Interview Cube",
      questions: 3,
      difficulty: "medium",
      tags: ["Two Pointers"],
      status: "Solved",
    },
    {
      name: "Netflix Interview Cube",
      questions: 6,
      difficulty: "hard",
      tags: ["Stacks"],
      status: "Solved",
    },
  ];
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <div className="w-full">
        <h2>Conundrum Cubes</h2>
        <div className="mt-5 mb-5 flex gap-5 w-[70%]">
          <Input type="Search" label="Search Problems" size="sm" />
          <Select label="Difficulty" className="max-w-xs" size="sm">
            <SelectItem key="easy">
              Easy
            </SelectItem>
            <SelectItem key="medium">
              Medium
            </SelectItem>
            <SelectItem key="hard">
              Hard
            </SelectItem>
          </Select>
        </div>
        <div className="flex flex-wrap gap-3">
          {cubes.map((cube, index) => (
            <Card key={index} className="w-[30%] p-4shadow-sm rounded-md">
              <CardHeader>{cube.name}</CardHeader>
              <CardBody>
                <p className="text-sm text-gray-500">
                  {cube.questions} Questions
                </p>
                <p className="text-sm text-gray-500">
                  Difficulty: {cube.difficulty}
                </p>
                <p className="text-sm text-gray-500">
                  Tags: {cube.tags.join(", ")}
                </p>
                <p
                  className={`text-sm text-gray-500
                ${cube.status === "Solved" ? "text-green-500" : "text-red-500"}
                `}
                >
                  Status: {cube.status}
                </p>
              </CardBody>
              <CardFooter className="flex justify-end items-center">
                <Button variant="flat">Open</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ConundrumCubes;
