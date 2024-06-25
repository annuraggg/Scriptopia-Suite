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
  
interface UserProblem {
  title: string;
  difficulty: string;
  tags: string[];
  status: string;
}

interface UserProblemsListProps {
  userproblems: UserProblem[];
}
const UserGenerated = ({userproblems} : UserProblemsListProps) => {

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
          {userproblems.map((problem) => (
            <TableRow className="h-14">
              <TableCell className="w-[550px]">
                <p className="truncate max-w-[500px] cursor-pointer hover:text-blue-500">{problem.title}</p>
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
