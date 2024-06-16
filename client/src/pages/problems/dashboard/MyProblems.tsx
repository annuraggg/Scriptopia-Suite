import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const problems = [
  {
    name: "Two Sum",
    difficulty: "easy",
    tags: ["Array", "Hash Maps"],
    status: "Solved",
  },
  {
    name: "Add Two Numbers",
    difficulty: "medium",
    tags: ["Linked Lists"],
    status: "Solved",
  },
  {
    name: "Valid Parentheses",
    difficulty: "easy",
    tags: ["Stacks"],
    status: "Solved",
  },
  {
    name: "Longest Substring Without Repeating CharactersLongest Substring Without Repeating CharactersLongest Substring Without Repeating CharactersLongest Substring Without Repeating Characters",
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
    name: "Container With Most Water",
    difficulty: "medium",
    tags: ["Two Pointers"],
    status: "Solved",
  },
  {
    name: "Longest Valid Parentheses",
    difficulty: "hard",
    tags: ["Stacks"],
    status: "Solved",
  },
];

const openProblem = () => {
  console.log("Opening problem: ");
};

const MyProblems = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>My Problems</h2>
      <div className="mt-5 mb-5 flex gap-5 w-[70%]">
        <Input type="Search" label="Search Problems" size="sm" />
        <Select label="Difficulty" className="max-w-xs" size="sm">
          <SelectItem key="easy" value="easy">
            Easy
          </SelectItem>
          <SelectItem key="medium" value="medium">
            Medium
          </SelectItem>
          <SelectItem key="hard" value="hard">
            Hard
          </SelectItem>
        </Select>
      </div>

      <Button className="mb-5" onClick={() => navigate("/problems/new")}>
        + Add New Problem
      </Button>

      <Table isStriped>
        <TableHeader>
          <TableColumn>Problem</TableColumn>
          <TableColumn>Difficulty</TableColumn>
          <TableColumn>Tags</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <TableRow className="h-14">
              <TableCell className="w-[550px]  cursor-pointer hover:text-blue-500" onClick={() => openProblem()}>
                <p className="truncate max-w-[500px]">{problem.name}</p>
              </TableCell>
              <TableCell
                className={`
          ${problem.difficulty === "easy" && "text-green-400"}
          ${problem.difficulty === "medium" && "text-yellow-400"}
          ${problem.difficulty === "hard" && "text-red-400"}  
          `}
              >
                {problem.difficulty.slice(0, 1).toUpperCase() +
                  problem.difficulty.slice(1)}
              </TableCell>
              <TableCell className="w-[300px]">
                <p className="truncate max-w-[250px]">
                  {problem.tags.join(", ")}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex gap-5 items-center justify-center">
                  <button className="text-blue-400">Edit</button>
                  <button className="text-red-400">Delete</button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyProblems;
