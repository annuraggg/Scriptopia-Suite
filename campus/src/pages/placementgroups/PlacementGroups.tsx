import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Search, Plus, MoreVertical, Copy, Archive } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import Filter from "./Filter";
import { PlacementGroup } from "@shared-types/PlacementGroup";
import { Department } from "@shared-types/Institute";

const PlacementGroups = () => {
  const [groups, setGroups] = useState<PlacementGroup[]>([]);
  const [instituteDepartments, setInstituteDepartments] = useState<
    Department[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [sort, setSort] = useState<string>("newest");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    year: string;
    departments: string[];
  }>({
    year: "",
    departments: [],
  });

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get("/placement-groups");
      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log("Placement Groups:", response.data.data);
          setGroups(response.data.data);
        } else {
          console.error(
            "Unexpected response structure for placementGroups:",
            response.data
          );
          setError("Unexpected data format from API");
        }

        if (
          response.data.data &&
          Array.isArray(response.data.data.departments)
        ) {
          console.log("Departments:", response.data.data.departments);
          setInstituteDepartments(response.data.data.departments);
        } else {
          console.error(
            "Unexpected response structure for departments:",
            response.data
          );
        }
      } else {
        console.error("API returned error:", response.data);
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (!showCreateGroup) {
      fetchGroups();
    }
  }, [showCreateGroup]);

  const filteredGroups = useMemo(() => {
    return (groups || [])
      .filter((group) => {
        const groupName = group.name || "";
        if (
          searchTerm &&
          !groupName.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        const isArchived = !!group.archived;
        if (filter === "active" && isArchived) return false;
        if (filter === "archived" && !isArchived) return false;

        if (activeFilters.year) {
          const yearString = `${group.academicYear.start || ""}-${
            group.academicYear.end || ""
          }`;
          if (!yearString.includes(activeFilters.year)) {
            return false;
          }
        }

        if (activeFilters.departments.length > 0) {
          const groupDepts = Array.isArray(group.departments)
            ? group.departments
            : [];
          const hasMatchingDepartment = activeFilters.departments.some(
            (deptId) => groupDepts.includes(deptId)
          );
          if (!hasMatchingDepartment) return false;
        }

        return true;
      })
      .sort((a, b) => {
        try {
          if (sort === "newest") {
            return (
              new Date(b?.createdAt || Date.now()).getTime() -
              new Date(a?.createdAt || Date.now()).getTime()
            );
          }
          return (
            new Date(a?.createdAt || Date.now()).getTime() -
            new Date(b?.createdAt || Date.now()).getTime()
          );
        } catch (error) {
          console.error("Error sorting groups:", error);
          return 0;
        }
      });
  }, [groups, searchTerm, filter, activeFilters, sort]);

  const handleFilterChange = (newFilters: {
    year: string;
    departments: string[];
  }) => {
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({ year: "", departments: [] });
  };

  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://scriptopiacampus.com/group/${id}`);
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await axios.post("/placementgroups/archive", { id });

      console.log("Archive response:", response.data);

      if (
        response.data &&
        (response.data.status === 200 || response.data.status === 201)
      ) {
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group._id === id ? { ...group, archived: !group.archived } : group
          )
        );
      }
    } catch (error) {
      console.error("Error archiving group:", error);
    }
  };

  const renderPlacementGroups = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">Loading groups...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-danger-50 dark:bg-danger-900 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-danger-700 dark:text-danger-300 mb-2">
            Error loading placement groups
          </h3>
          <p className="text-danger-500 dark:text-danger-400 mb-6">{error}</p>
          <Button color="primary" onClick={fetchGroups}>
            Retry
          </Button>
        </div>
      );
    }

    if (filteredGroups.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No placement groups found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm ||
            activeFilters.year ||
            activeFilters.departments.length > 0
              ? "Try adjusting your search or filters"
              : "Create your first placement group to get started"}
          </p>
          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onClick={() => setShowCreateGroup(true)}
          >
            Create New Group
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <Card
            key={group._id}
            className="p-4 cursor-pointer w-full hover:shadow-md transition-shadow"
            isPressable
            onClick={() => navigate(`/placement-groups/${group._id}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      group.archived
                        ? "bg-default-100 text-default-600"
                        : "bg-success-100 text-success-600"
                    }`}
                  >
                    {group.archived ? "Archived" : "Active"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-default-500 mb-4">
                  <span>
                    {group.academicYear.start} - {group.academicYear.end}
                  </span>
                  <span>
                    Created: {new Date(group?.createdAt!).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(group.departments) &&
                    group.departments.map((deptId) => {
                      const dept = instituteDepartments.find(
                        (d) => d._id === deptId
                      );
                      return (
                        <span
                          key={deptId}
                          className="px-2 py-1 bg-default-100 rounded-full text-xs"
                        >
                          {dept?.name || deptId}
                        </span>
                      );
                    })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant="flat"
                  onClick={(e) => handleCopyLink(group._id!, e)}
                >
                  <Copy size={18} />
                </Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      variant="flat"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    onAction={(key) => {
                      if (key === "archive") {
                        handleArchive(group._id!, {
                          stopPropagation: () => {},
                        } as React.MouseEvent);
                      } else if (key === "edit") {
                        navigate(`//placement-groups/${group._id}/edit`);
                        const event = window.event;
                        if (event) {
                          event.stopPropagation();
                        }
                      }
                    }}
                  >
                    <DropdownItem key="edit">Edit</DropdownItem>
                    <DropdownItem
                      key="archive"
                      className="text-danger"
                      color="danger"
                      startContent={<Archive size={18} />}
                    >
                      {group.archived ? "Unarchive" : "Archive"}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key="groups-list"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Student Placement Groups</h1>
            <Button
              color="primary"
              startContent={<Plus size={20} />}
              onClick={() => navigate("create")}
            >
              Create New Group
            </Button>
          </div>

          <div className="flex gap-8">
            <div className="w-1/4">
              <Filter
                departments={instituteDepartments}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
            <div className="w-3/4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 items-center">
                  <Select
                    className="w-[200px]"
                    selectedKeys={[sort]}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <SelectItem key="newest">Newest</SelectItem>
                    <SelectItem key="oldest">Oldest</SelectItem>
                  </Select>

                  <Input
                    className="w-[300px]"
                    placeholder="Search Group"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={
                      <Search className="text-default-400" size={20} />
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <Button
                  className={`w-1/3 ${
                    filter === "all" ? "bg-default-100" : ""
                  }`}
                  variant={filter === "all" ? "flat" : "ghost"}
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  className={`w-1/3 ${
                    filter === "active" ? "bg-success-100" : ""
                  }`}
                  variant={filter === "active" ? "flat" : "ghost"}
                  onClick={() => setFilter("active")}
                >
                  Active
                </Button>
                <Button
                  className={`w-1/3 ${
                    filter === "archived" ? "bg-default-100" : ""
                  }`}
                  variant={filter === "archived" ? "flat" : "ghost"}
                  onClick={() => setFilter("archived")}
                >
                  Archived
                </Button>
              </div>

              {renderPlacementGroups()}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PlacementGroups;
