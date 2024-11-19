import Sections from "./mcq/Sections";
import Sidebar from "./mcq/Sidebar";

const MCQDashboard = ({  }: { timer: number }) => {
  return (
    <div className="h-full p-5">
      <p>MCQ Assessment</p>
      <div className="mt-5 h-[93%] flex gap-2">
        <Sidebar />
        <Sections />
      </div>
    </div>
  );
};

export default MCQDashboard;
