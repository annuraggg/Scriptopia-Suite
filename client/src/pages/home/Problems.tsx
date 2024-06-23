import { Input, Select, SelectItem } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Problem {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  status: "Solved" | "Not Solved";
}

const Problems = () => {
  const navigate = useNavigate();
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

  const { error, data, isLoading } = useQuery({
    queryKey: ["dashboard-get-problems"],
    queryFn: async () => (await axios.get("http://localhost:3000/home")).data,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const goToProblem = () => {
    navigate("/problems/1");
  };

  return (
    <div>
      <h6 className="text-md mt-2 text-gray-500 mb-5">Problems</h6>
      <div className="flex gap-5 line-clamp-1 flex-wrap h-5">
        {tags.map((tag, i) => (
          <div
            className="hover:text-blue-500 duration-200 transition-colors cursor-pointer text-sm"
            key={i}
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-5 w-[70%]">
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

      <div className="mt-5">
        <Table isStriped aria-label="Problems">
          <TableHeader>
            <TableColumn>Problem</TableColumn>
            <TableColumn>Difficulty</TableColumn>
            <TableColumn>Tags</TableColumn>
            <TableColumn>Status</TableColumn>
          </TableHeader>
          <TableBody>
            {data?.data?.problems?.map((problem: Problem) => (
              <TableRow className="h-14" key={problem.name}>
                <TableCell
                  className="w-[550px] hover:text-blue-500 cursor-pointer"
                  onClick={goToProblem}
                >
                  <p className="truncate max-w-[500px]">{problem.name}</p>
                </TableCell>
                <TableCell
                  className={`
                    ${problem.difficulty.toLowerCase() === "easy" && "text-green-400"}
                    ${problem.difficulty.toLowerCase() === "medium" && "text-yellow-400"}
                    ${problem.difficulty.toLowerCase() === "hard" && "text-red-400"}  
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
