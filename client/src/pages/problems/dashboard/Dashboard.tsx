import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { UsersRound, BookUser, Percent } from "lucide-react";
import IProblem from "@/@types/Problem";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ myproblems }: { myproblems: IProblem[] }) => {
  const navigate = useNavigate();
  const openProblem = (id: string) => {
    navigate(`/problems/${id}`);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProblems = myproblems.filter((problem) =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Cards = [
    {
      title: "Total Solutions",
      icon: UsersRound,
      value: 20,
      color: "text-blue-500",
    },
    {
      title: "Total Problems",
      icon: BookUser,
      value: 20,
      color: "text-red-500",
    },
    {
      title: "Acceptance Rate",
      icon: Percent,
      value: 70,
      color: "text-green-500",
    },
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-10 h-[100%]"
    >
      <div className="w-full">
        <p className="mb-3 opacity-50">Your Problems Dashboard</p>
        <div className="flex justify-between w-full gap-5">
          {Cards.map((card, index) => (
            <Card key={index} className="h-32 w-full">
              <CardHeader className="text-center flex justify-center text-gray-400">
                {card.title}
              </CardHeader>
              <CardBody className="flex justify-center items-start gap-5 flex-row">
                <card.icon size={30} className={`${card.color}`} />
                <p className="text-xl">{card.value}</p>
              </CardBody>
            </Card>
          ))}
          {/* <Card className="h-40 w-60 pt-2">
            <CardHeader className="text-center flex flex-row gap-2 justify-center text-gray-400">
              <UsersRound size={25} className="text-yellow-500" />
              <p className="text-yellow-500">Top Contributors</p>
            </CardHeader>
            <CardBody className="flex justify-center items-start gap-3 flex-row"></CardBody>
          </Card> */}
        </div>
        {/* <div className="flex flex-col">
          <div className="flex flex-row justify-start items-center pt-5 w-full">
            <Card className="p-2 w-full">
              <CardBody className="flex flex-row flex-wrap justify-between items-start gap-36 p-1 pl-4">
                <p className="mt-3 left-element">Latest Activities</p>
                <Input
                  type="Search"
                  label="Search Problems"
                  size="sm"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-[80vh] right-element"
                />
              </CardBody>
            </Card>
          </div>
          <div className="flex justify-center items-center pt-5 w-[]">
            <Table isStriped>
              <TableHeader>
                <TableColumn>Problem</TableColumn>
                <TableColumn>Acceptance</TableColumn>
                <TableColumn>Difficulty</TableColumn>
                <TableColumn>Tags</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredProblems.map((problem) => (
                  <TableRow className="h-14" key={problem.title}>
                    <TableCell
                      className="w-[550px] cursor-pointer hover:text-blue-500"
                      onClick={() => openProblem(problem._id)}
                    >
                      <p className="truncate max-w-[500px]">{problem.title}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-green-500">
                        {problem.acceptanceRate || `70%`}
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
        </div> */}
      </div>
    </motion.div>
  );
};

export default Dashboard;
