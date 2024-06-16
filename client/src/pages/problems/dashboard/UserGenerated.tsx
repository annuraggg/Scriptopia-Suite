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
} from "@nextui-org/react";

const UserGenerated = () => {
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
      <h2>User Generated Problems</h2>
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
      <Table isStriped>
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
                <p className="truncate max-w-[500px] cursor-pointer hover:text-blue-500">{problem.name}</p>
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
  );
};

export default UserGenerated;
