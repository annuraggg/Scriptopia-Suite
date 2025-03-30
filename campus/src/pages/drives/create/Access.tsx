import { Button, Card, Checkbox } from "@nextui-org/react";
import { PlacementGroup } from "@shared-types/PlacementGroup";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";

interface AccessProps {
  setAction: Dispatch<SetStateAction<number>>;
  placementGroups: (PlacementGroup | string)[];
  selectedGroups: string[];
  onSelectGroups: (ids: string[]) => void;
}

const Access = ({ 
  setAction, 
  placementGroups = [], 
  selectedGroups, 
  onSelectGroups 
}: AccessProps) => {
  const [loadedGroups, setLoadedGroups] = useState<PlacementGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    const fetchPlacementGroups = async () => {
      if (placementGroups.length === 0 || 
          (typeof placementGroups[0] === 'string' && !loadedGroups.length)) {
        setLoading(true);
        try {
          const response = await axios.get("/placement-groups");
          if (response.data && response.data.success) {
            setLoadedGroups(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching placement groups:", error);
        } finally {
          setLoading(false);
        }
      } else if (typeof placementGroups[0] !== 'string') {
        setLoadedGroups(placementGroups as PlacementGroup[]);
      }
    };

    fetchPlacementGroups();
  }, [placementGroups]);

  const handleCheckboxChange = (groupId: string) => {
    const newSelected = selectedGroups.includes(groupId)
      ? selectedGroups.filter(id => id !== groupId)
      : [...selectedGroups, groupId];
    onSelectGroups(newSelected);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Placement Groups</h3>
        <p className="text-default-500">
          Choose which placement groups will have access to this drive
        </p>
        
        {loading ? (
          <p>Loading placement groups...</p>
        ) : (
          <div className="space-y-2">
            {loadedGroups.map((group) => (
              <Card key={group._id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-default-500">
                      {group.academicYear.start} - {group.academicYear.end}
                    </p>
                    <p className="text-xs text-default-400">
                      {group.candidates?.length || 0} candidates
                    </p>
                  </div>
                  <Checkbox
                    isSelected={selectedGroups.includes(group._id!)}
                    onChange={() => handleCheckboxChange(group._id!)}
                  />
                </div>
              </Card>
            ))}
            {loadedGroups.length === 0 && !loading && (
              <p className="text-default-500">No placement groups available.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="flat"
          startContent={<ChevronLeft size={20} />}
          onPress={() => setAction(1)}
        >
          Back
        </Button>
        <Button
          variant="flat"
          endContent={<ChevronRight size={20} />}
          onPress={() => setAction(3)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Access;