import IProblem from "@/@types/Problem";
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

const Problems = ({
  problems,
  tags,
  solvedProblems,
}: {
  problems: IProblem[];
  tags: string[];
  solvedProblems: string[];
}) => {
  const navigate = useNavigate();

  return (
    <div className="">
      <h6 className="text-md mt-2 text-gray-500 mb-5 sm:text-xl">Problems</h6>
      <div className="flex gap-5 line-clamp-1 flex-wrap h-5">
        {tags?.map((tag, i) => (
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
            {problems?.map((problem: IProblem) => (
              <TableRow className="h-14" key={problem.title}>
                <TableCell
                  className="w-[550px] hover:text-blue-500 cursor-pointer"
                  onClick={() => navigate(`/problem/${problem._id}`)}
                >
                  <p className="truncate max-w-[500px]">{problem.title}</p>
                </TableCell>
                <TableCell
                  className={`
                    ${
                      problem.difficulty.toLowerCase() === "easy" &&
                      "text-green-400"
                    }
                    ${
                      problem.difficulty.toLowerCase() === "medium" &&
                      "text-yellow-400"
                    }
                    ${
                      problem.difficulty.toLowerCase() === "hard" &&
                      "text-red-400"
                    }  
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
                  {solvedProblems?.find(
                    (solvedProblem) => solvedProblem === problem._id
                  )
                    ? "Solved"
                    : "Not Solved"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Problems;
