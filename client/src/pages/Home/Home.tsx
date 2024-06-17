import { motion } from "framer-motion";
import Problems from "./Problems";
import ProblemsChart from "./ProblemsChart";
import StreakCalender from "./StreakCalender";
import Timer from "./Timer";

const Home = () => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex gap-10 pb-10"
    >
      <div className="w-[80%]">
        <Problems />
      </div>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex gap-5 flex-col w-[20%]"
      >
        <StreakCalender />
        <Timer />
        <ProblemsChart easy={10} medium={5} hard={2} />
      </motion.div>
    </motion.div>
  );
};

export default Home;
