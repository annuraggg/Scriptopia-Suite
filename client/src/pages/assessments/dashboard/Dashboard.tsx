import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { UsersRound, BookUser, Disc2, BookCheck } from "lucide-react";

const Dashboard = () => {
  const cards = [
    {
      title: "Total Students",
      icon: UsersRound,
      value: 200,
      color: "text-blue-500",
    },
    {
      title: "Total Assessments",
      icon: BookUser,
      value: 15,
      color: "text-red-500",
    },
    {
      title: "Assessments Taken",
      icon: BookCheck,
      value: 200,
      color: "text-yellow-500",
    },
  ];

  const topPerformers = [
    {
      name: "John Doe",
      score: 98,
    },
    {
      name: "Jane Doe",
      score: 95,
    },
    {
      name: "John Smith",
      score: 90,
    },
    {
      name: "Jane Smith",
      score: 85,
    },
    {
      name: "John Doe",
      score: 80,
    },
    {
      name: "Jane Doe",
      score: 75,
    },
  ];

  const topCheaters = [
    {
      name: "John Doe",
      cheatingDetected: 22,
    },
    {
      name: "Jane Doe",
      cheatingDetected: 20,
    },
    {
      name: "John Smith",
      cheatingDetected: 18,
    },
    {
      name: "Jane Smith",
      cheatingDetected: 15,
    },
    {
      name: "John Doe",
      cheatingDetected: 12,
    },
    {
      name: "Jane Doe",
      cheatingDetected: 10,
    },
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full p-10 h-[90vh]"
    >
    <div className="w-full h-[90vh]">
      <div className="flex justify-between w-full flex-wrap">
        {cards.map((card, index) => (
          <Card key={index} className="h-32 w-56">
            <CardHeader className="text-center flex justify-center text-gray-400">
              {card.title}
            </CardHeader>
            <CardBody className="flex justify-center items-start gap-5 flex-row">
              <card.icon size={30} className={`${card.color}`} />
              <p className="text-xl">{card.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="flex gap-10">
        <Card className="h-fit w-full mt-10 drop-shadow-glow-extralight">
          <CardHeader className="text-center flex justify-center text-gray-400">
            Top Performers
          </CardHeader>
          <CardBody className="px-7">
            {topPerformers.map((performer, index) => (
              <div
                className="flex h-14 justify-between items-center"
                key={index}
              >
                <p className="text-md">
                  {index + 1}. {performer.name}
                </p>
                <p className="text-xs text-gray-400">
                  Score: {performer.score}%
                </p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="h-fit w-full mt-10 drop-shadow-glow-extralight-red">
          <CardHeader className="text-center flex justify-center text-gray-400">
            Top Cheaters
          </CardHeader>
          <CardBody className="px-7">
            {topCheaters.map((cheater, index) => (
              <div
                className="flex h-14 justify-between items-center"
                key={index}
              >
                <p className="text-md">
                  {index + 1}. {cheater.name}
                </p>
                <p className="text-xs text-gray-400">
                  Cheating Detected: {cheater.cheatingDetected}
                </p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
   </motion.div>
  );
};

export default Dashboard;
