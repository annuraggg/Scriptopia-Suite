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
} from "@heroui/react";
import { Problem as VanillaProblem } from "@shared-types/Problem";
import { useNavigate } from "react-router-dom";

interface Problem extends VanillaProblem {
  _id: string;
  status: string;

  solved: boolean;
  acceptanceRate: number;
}

const UserGenerated = ({ userproblems }: { userproblems: Problem[] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value);
  };

  const handleTagSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTagSearch(event.target.value);
  };

  const filteredProblems = userproblems.filter((problem) => {
    const searchFilter =
      searchTerm === "" ||
      problem.title.toLowerCase().includes(searchTerm.toLowerCase());

    const difficultyFilter =
      selectedDifficulty === "" || problem.difficulty === selectedDifficulty;

    const tagFilter =
      tagSearch === "" ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(tagSearch.toLowerCase())
      );

    return searchFilter && difficultyFilter && tagFilter;
  });

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div>
        <h2>User Generated Problems</h2>
        <div className="mt-5 mb-5 flex gap-5 w-[full]">
          <Input
            type="Search"
            label="Search Problems"
            size="sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Input
            type="Search"
            label="Search Tags"
            size="sm"
            value={tagSearch}
            onChange={handleTagSearchChange}
            className="flex-1 min-w-[200px]"
          />
          <Select
            label="Difficulty"
            className="max-w-xs"
            size="sm"
            selectedKeys={[selectedDifficulty]}
            onChange={(event) => handleDifficultyChange(event.target.value)}
          >
            <SelectItem key="easy">
              Easy
            </SelectItem>
            <SelectItem key="medium" >
              Medium
            </SelectItem>
            <SelectItem key="hard" >
              Hard
            </SelectItem>
          </Select>
        </div>
        <Table isStriped>
          <TableHeader>
            <TableColumn>Problem</TableColumn>
            <TableColumn>Difficulty</TableColumn>
            <TableColumn>Tags</TableColumn>
            <TableColumn>Acceptance Rate</TableColumn>
            <TableColumn>Status</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredProblems.map((problem) => (
              <TableRow className="h-14" key={problem._id}>
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
                <TableCell className="justify-center items-center">
                  {Number(problem.acceptanceRate.toFixed(1)).toString()}%
                </TableCell>
                <TableCell>{problem.solved ? "Solved" : "Unsolved"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default UserGenerated;
