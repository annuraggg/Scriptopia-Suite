import Loader from "@/components/Loader";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { PlacementGroup } from "@shared-types/PlacementGroup";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

const PlacementGroups = () => {
  const [placementGroups, setPlacementGroups] = useState<PlacementGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .get("/placement-groups/candidate")
      .then((res) => {
        setPlacementGroups(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.response.data.message || "An error occurred while fetching groups"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Format date for display
  const formatDate = (date: string | Date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  return (
    <div className=" mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Placement Groups</h1>

      {placementGroups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg">No placement groups found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {placementGroups.map((group) => (
            <div key={group._id} className="border rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-medium truncate">{group.name}</h2>
                {group.accessType === "private" && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200">
                    Private
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Academic Year:</span>{" "}
                  {group.academicYear.start} - {group.academicYear.end}
                </p>
                {group.purpose && (
                  <p>
                    <span className="font-medium">Purpose:</span>{" "}
                    <span className="line-clamp-2">{group.purpose}</span>
                  </p>
                )}
                <p>
                  <span className="font-medium">Expires:</span>{" "}
                  {formatDate(group.expiryDate)}
                </p>
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {group.createdAt ? formatDate(group.createdAt) : "N/A"}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs">
                  {group.candidates.length} candidate
                  {group.candidates.length !== 1 ? "s" : ""}
                </span>
                <button className="text-sm font-medium px-3 py-1 border rounded-md hover:bg-gray-50">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacementGroups;
