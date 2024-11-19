import { motion } from "framer-motion";
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
import { Problem as VanillaProblem } from "@shared-types/Problem";
import { useNavigate } from "react-router-dom";

interface Problem extends VanillaProblem {
  _id: string;
  status: string;
}

const UserGenerated = ({ userproblems }: { userproblems: Problem[] }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
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
              <TableRow className="h-14" key={problem.title}>
                <TableCell className="w-[550px]">
                  <p
                    className="truncate max-w-[500px] cursor-pointer hover:text-blue-500"
                    onClick={() => navigate(`/problems/${problem._id}`)}
                  >
                    {problem.title}
                  </p>
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
    </motion.div>
  );
};

export default UserGenerated;
