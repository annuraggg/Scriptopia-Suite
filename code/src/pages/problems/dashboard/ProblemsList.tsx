import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Problem as VanillaProblem } from "@shared-types/Problem";

interface Problem extends VanillaProblem {
  _id: string;
  status: string;
}

const ProblemsList = ({ problems }: { problems: Problem[] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value);
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearchTerm = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "" || problem.difficulty === selectedDifficulty;

    return matchesSearchTerm && matchesDifficulty;
  });

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div>
        <h2>Scriptopia Problems</h2>
        <div className="mt-5 mb-5 flex gap-5 w-[70%]">
          <Input
            type="Search"
            label="Search"
            size="sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Select
            label="Difficulty"
            className="max-w-xs"
            size="sm"
            value={selectedDifficulty}
            onChange={(event) => handleDifficultyChange(event.target.value)}
          >
            <SelectItem key="all" value="">
              All
            </SelectItem>
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
            {filteredProblems.map((problem, index) => (
              <TableRow key={index} className="h-14">
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

export default ProblemsList;
