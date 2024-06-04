import { Input, Select, SelectItem } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
const Problems = () => {
  const tags = [
    "Array",
    "Hash Maps",
    "Strings",
    "Two Pointers",
    "Linked Lists",
    "Stacks",
    "Array",
    "Hash Maps",
    "Strings",
    "Two Pointers",
    "Linked Lists",
    "Stacks",
    "Array",
    "Hash Maps",
    "Strings",
    "Two Pointers",
    "Linked Lists",
    "Stacks",
    "Array",
    "Hash Maps",
    "Strings",
    "Two Pointers",
    "Linked Lists",
    "Stacks",
    "Array",
    "Hash Maps",
    "Strings",
    "Two Pointers",
    "Linked Lists",
    "Stacks",
  ];

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

  return (
    <div>
      <h2 className="text-xl text-gray-500 mb-5">Problems</h2>
      <div className="flex gap-5 line-clamp-1 flex-wrap h-5">
        {tags.map((tag) => (
          <div className="hover:text-blue-500 duration-200 transition-colors cursor-pointer">
            {tag}
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-5 w-[70%]">
        <Input type="Search" label="Email" size="sm" />
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

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableColumn>Problem</TableColumn>
            <TableColumn>Difficulty</TableColumn>
            <TableColumn>Tags</TableColumn>
            <TableColumn>Status</TableColumn>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow className="h-14">
                <TableCell className="w-[550px]">
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
                <TableCell>{problem.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Problems;
