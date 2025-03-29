import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronRight, ClipboardList, UserCheck } from "lucide-react";
import { Assignment, Drive } from "@shared-types/Drive";

const Main = () => {
  const { drive } = useOutletContext() as { drive: Drive };
  const navigate = useNavigate();

  return (
    <div className="mx-auto p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex items-center mb-8">
        <ClipboardList className="mr-3 text-indigo-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
      </div>

      {drive?.assignments?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No assignments available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drive?.assignments?.map((assignment: Assignment) => (
            <div
              key={assignment._id}
              onClick={() => navigate(`${assignment._id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer border border-gray-100"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {assignment.name}
                  </h2>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {drive?.workflow?.steps?.find(
                      (step) => step._id === assignment.workflowId
                    )?.status === "in-progress"
                      ? "In Progress"
                      : drive?.workflow?.steps?.find(
                          (step) => step._id === assignment.workflowId
                        )?.status === "pending"
                      ? "Pending"
                      : "In Progress"}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {assignment.description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <UserCheck size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {assignment.submissions?.length ?? 0}{" "}
                      {assignment.submissions?.length === 1
                        ? "submission"
                        : "submissions"}
                    </span>
                  </div>

                  <div className="flex items-center text-indigo-600 font-medium">
                    <span className="mr-1 text-sm">View details</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;
