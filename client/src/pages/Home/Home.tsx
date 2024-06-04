import Problems from "./Problems";
import ProblemsChart from "./ProblemsChart";
import StreakCalender from "./StreakCalender";
import Timer from "./Timer";

const Home = () => {
  return (
    <div className="flex gap-10">
      <div className="w-[80%]">
        <Problems />
      </div>
      <div className="flex gap-5 flex-col w-[20%]">
        <StreakCalender />
        <Timer />
        <ProblemsChart easy={10} medium={5} hard={2} />
      </div>
    </div>
  );
};

export default Home;
