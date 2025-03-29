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
  Button,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Problem } from "@shared-types/Problem";
import DeleteProblemModal from "./DeleteProblemModal";

const MyProblems = ({ myproblems }: { myproblems: Problem[] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const openProblem = (id: string) => {
    navigate(`/problems/${id}`);
  };

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

  const filteredProblems = myproblems.filter((problem) => {
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
      <div className="w-full">
        <h2>My Problems</h2>

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
            <SelectItem key="medium">
              Medium
            </SelectItem>
            <SelectItem key="hard">
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
            {filteredProblems.map((problem) => (
              <TableRow className="h-14" key={problem.title}>
                <TableCell
                  className="w-[550px] cursor-pointer hover:text-blue-500"
                  onClick={() => openProblem(problem?._id || "")}
                >
                  <p className="truncate max-w-[500px]">{problem.title}</p>
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
                  <div className="flex items-start justify-items-start">
                    <DeleteProblemModal
                      problemId={problem._id || ""}
                      problemTitle={problem.title}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default MyProblems;
