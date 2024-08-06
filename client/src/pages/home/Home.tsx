// src/components/Home.tsx

import { motion } from "framer-motion";
import Problems from "./Problems";
import ProblemsChart from "./ProblemsChart";
import StreakCalender from "./StreakCalendar";
// import Timer from "./Timer";
import { useQuery } from "@tanstack/react-query";
import ax from "@/config/axios";
import Loader from "@/components/Loader";
import { useAuth } from "@clerk/clerk-react";

const Home = () => {
  const { getToken } = useAuth();
  const axios = ax(getToken)

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-get-problems"],
    queryFn: async () => (await axios.get("/home")).data,
  });

  if (isLoading) return <Loader />;

  console.log(data);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 pb-10 h-screen md:h-auto overflow-y-auto md:overflow-y-visible">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-[80%] order-1 md:order-1 h-screen"
        >
          <Problems
            problems={data?.data?.problems}
            tags={data?.data?.tags}
            solvedProblems={data?.data?.solvedProblems}
          />
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-[20%] flex gap-5 flex-col order-2 md:order-2 h-screen"
        >
          {data?.data?.streak ? (
            <StreakCalender dates={data?.data?.streak} />
          ) : (
            <p>No Streaks Yet</p>
          )}
          {/* <Timer /> */}
          <ProblemsChart
            easyNo={data?.data?.problemsCount.easy}
            mediumNo={data?.data?.problemsCount.medium}
            hardNo={data?.data?.problemsCount.hard}
          />
        </motion.div>
      </div>
    </>
  );
};

export default Home;
