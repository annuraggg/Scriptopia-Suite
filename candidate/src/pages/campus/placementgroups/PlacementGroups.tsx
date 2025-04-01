import Loader from "@/components/Loader";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { PlacementGroup } from "@shared-types/PlacementGroup";
import { Candidate } from "@shared-types/Candidate";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardBody, Tabs, Tab, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input } from "@nextui-org/react";
import { DataTable } from "./DataTable";
import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

const PlacementGroups = () => {
  const [placementGroups, setPlacementGroups] = useState<PlacementGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<PlacementGroup | null>(null);
  const [selected, setSelected] = useState("details");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  // const navigate = useNavigate();

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    fetchPlacementGroups();
  }, []);

  const fetchPlacementGroups = () => {
    setLoading(true);
    axios
      .get("/placement-groups/candidate")
      .then((res) => {
        setPlacementGroups(res.data.data);
        setSelectedGroup(null);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.response?.data?.message || "An error occurred while fetching groups"
        );
      })
      .finally(() => setLoading(false));
  };

  const formatDate = (date: string | Date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const handleGroupSelect = (group: PlacementGroup) => {
    setSelectedGroup(group);
    setSelected("details");
  };

  const filteredGroups = placementGroups
    .filter(group => {
      const matchesSearch = searchQuery === "" ||
        group.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear = filterYear === "all" ||
        `${group.academicYear.start} - ${group.academicYear.end}` === filterYear;

      return matchesSearch && matchesYear;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const getYearOptions = () => {
    const years = new Set(placementGroups.map(group => `${group.academicYear.start} - ${group.academicYear.end}`));
    return Array.from(years);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Student Placement Groups
        </h1>
      </div>

      {!selectedGroup ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Side - Filters */}
          <div className="lg:col-span-1">
            <Card className="p-4 mb-6">
              <CardBody className="p-0">
                <h2 className="text-xl font-bold mb-4">Filters</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Year</h3>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="w-full justify-between"
                          endContent={<ChevronDown size={16} />}
                        >
                          {filterYear === "all" ? "Select year" : filterYear}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Year selection"
                        selectionMode="single"
                        selectedKeys={[filterYear]}
                        onSelectionChange={(keys) => setFilterYear(Array.from(keys)[0] as string)}
                      >
                        <DropdownItem key="all">All</DropdownItem>
                        <>
                          {getYearOptions().map(year => (
                            <DropdownItem key={year}>{year}</DropdownItem>
                          ))}
                        </>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Department</h3>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer bg-primary text-white">
                        <span>All</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="flat"
                    color="default"
                    className="w-full mt-4"
                    onClick={() => {
                      setFilterYear("all");
                      setSearchQuery("");
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Side - Groups List */}
          <div className="lg:col-span-3">
            {/* Top Bar with Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      className="w-full sm:w-auto justify-between"
                      endContent={<ChevronDown size={16} />}
                    >
                      {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : "Alphabetical"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Sort options"
                    selectionMode="single"
                    selectedKeys={[sortBy]}
                    onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                  >
                    <DropdownItem key="newest">Newest</DropdownItem>
                    <DropdownItem key="oldest">Oldest</DropdownItem>
                    <DropdownItem key="alphabetical">Alphabetical</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex-1 sm:flex-grow-[6]">
                <Input
                  placeholder="Search Group"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startContent={<Search size={18} />}
                  className="w-full"
                />
              </div>
            </div>

            {/* Groups List */}
            {filteredGroups.length === 0 ? (
              <div className="text-center py-8 bg-default-50 rounded-lg p-8">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No placement groups found</p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">No groups match your current filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGroups.map((group) => (
                  <Card
                    key={group._id}
                    className="cursor-pointer hover:shadow-md transition-shadow w-full"
                    isPressable
                    onClick={() => handleGroupSelect(group)}
                  >
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-semibold">{group.name}</h2>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${new Date(group.expiryDate) > new Date()
                              ? "bg-success/20 text-success"
                              : "bg-default-200 text-default-600"
                              }`}>
                              {new Date(group.expiryDate) > new Date() ? "Active" : "Archived"}
                            </span>
                          </div>
                          <div className="text-sm text-default-500">
                            {group.academicYear.start} - {group.academicYear.end}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-default-500">
                            Created: {formatDate(group.createdAt || new Date(0))}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full">
          {/* Back Button */}
          <Button
            variant="light"
            color="default"
            className="mb-4"
            onClick={() => setSelectedGroup(null)}
          >
            ← Back to groups
          </Button>

          <div className="flex items-center justify-between p-2 mb-4">
            <h1 className="text-xl font-bold">{selectedGroup.name}</h1>
          </div>

          {/* Tabs */}
          <Tabs
            selectedKey={selected}
            onSelectionChange={setSelected as any}
            variant="underlined"
            color="primary"
            className="mt-4"
          >
            {/* Group Details Tab */}
            <Tab key="details" title="Group Details">
              <div className="space-y-6 mt-5">
                <Card className="bg-default-50 p-2">
                  <CardBody>
                    <h3 className="text-xl font-semibold mb-4">Group Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="mx-2">
                        <p className="text-sm text-default-500 mb-1">Group Name</p>
                        <p className="text-base font-medium">{selectedGroup.name}</p>
                      </div>

                      <div className="mx-2">
                        <p className="text-sm text-default-500 mb-1">College Batch</p>
                        <p className="text-base font-medium">
                          {selectedGroup.academicYear.start} - {selectedGroup.academicYear.end}
                        </p>
                      </div>

                      <div className="mx-2">
                        <p className="text-sm text-default-500 mb-1">Access Type</p>
                        <p className="text-base font-medium capitalize">
                          {selectedGroup.accessType}
                        </p>
                      </div>

                      <div className="mx-2">
                        <p className="text-sm text-default-500 mb-1">Expiry Date</p>
                        <p className="text-base font-medium">
                          {formatDate(selectedGroup.expiryDate)}
                        </p>
                      </div>

                      <div className="mx-2 md:col-span-2">
                        <p className="text-sm text-default-500 mb-1">Group Purpose</p>
                        <p className="text-base font-medium">{selectedGroup.purpose || "No purpose specified"}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-default-50 p-2">
                  <CardBody>
                    <h3 className="text-xl font-semibold mb-4">Group Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="mx-2 p-4 rounded-lg bg-primary/10 text-center">
                        <p className="text-2xl font-bold text-primary">{selectedGroup.candidates.length}</p>
                        <p className="text-sm text-default-600">Total Candidates</p>
                      </div>

                      <div className="mx-2 p-4 rounded-lg bg-success/10 text-center">
                        <p className="text-2xl font-bold text-success">
                          {selectedGroup.createdAt ? formatDate(selectedGroup.createdAt) : "N/A"}
                        </p>
                        <p className="text-sm text-default-600">Created On</p>
                      </div>

                      <div className="mx-2 p-4 rounded-lg bg-warning/10 text-center">
                        <p className="text-2xl font-bold text-warning">
                          {formatDate(selectedGroup.expiryDate)}
                        </p>
                        <p className="text-sm text-default-600">Expires On</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>

            {/* Students Tab */}
            <Tab key="students" title="Student Details">
              <div className="mt-5">
                {selectedGroup.candidates && selectedGroup.candidates.length > 0 ? (
                  <DataTable
                    data={selectedGroup.candidates.map(candidateId => ({ id: candidateId } as unknown as Candidate))}
                    type="active"
                    onDataUpdate={fetchPlacementGroups}
                  />
                ) : (
                  <Card className="bg-default-50 p-6 text-center">
                    <p className="text-lg">No candidates in this group yet</p>
                  </Card>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      )}
    </motion.div>
  );
};

export default PlacementGroups;