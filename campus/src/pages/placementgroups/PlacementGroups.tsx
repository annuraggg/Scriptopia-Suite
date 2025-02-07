import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
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
import { Search, Plus, MoreVertical, Copy, Archive, ArrowLeft } from "lucide-react";
import Filter from "./Filter";
import CreateGroupForm from "./CreateGroupForm";

interface CreateCompanyFormProps {
  onClose: () => void;
}

interface Department {
  id: string;
  name: string;
}

interface PlacementGroup {
  id: string;
  name: string;
  year: string;
  status: "Active" | "Archived";
  studentCount: number;
  departments: Department[];
}

const PlacementGroups = () => {
  const [groups] = useState<PlacementGroup[]>([
    {
      id: "1",
      name: "College 2022-23",
      year: "2022-2023",
      status: "Active",
      studentCount: 150,
      departments: [
        { id: "1", name: "Computer Engineering" },
        { id: "2", name: "Information Technology" },
        { id: "3", name: "CSE-AIML" },
        { id: "4", name: "CSE-Data Science" },
        { id: "5", name: "Mechanical Engineering" },
        { id: "6", name: "Civil Engineering" },
      ],
    },
    {
      id: "2",
      name: "Placement Drive CS",
      year: "2022-2023",
      status: "Active",
      studentCount: 80,
      departments: [
        { id: "1", name: "Computer Engineering" },
        { id: "3", name: "CSE-AIML" },
        { id: "4", name: "CSE-Data Science" },
      ],
    },
    {
      id: "3",
      name: "College 2021-22",
      year: "2021-2022",
      status: "Archived",
      studentCount: 250,
      departments: [
        { id: "1", name: "Computer Engineering" },
        { id: "2", name: "Information Technology" },
        { id: "3", name: "CSE-AIML" },
        { id: "4", name: "CSE-Data Science" },
        { id: "5", name: "Mechanical Engineering" },
        { id: "6", name: "Civil Engineering" },
      ],
    },
  ]);


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

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // Apply search filter
      if (searchTerm && !group.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Apply status filter
      if (filter === "active" && group.status !== "Active") {
        return false;
      }
      if (filter === "archived" && group.status !== "Archived") {
        return false;
      }

      // Apply year filter
      if (activeFilters.year && group.year !== activeFilters.year) {
        return false;
      }

      // Apply department filter
      if (activeFilters.departments.length > 0) {
        const groupDeptIds = group.departments.map((dept) => dept.id);
        const hasMatchingDepartment = activeFilters.departments.some((deptId) =>
          groupDeptIds.includes(deptId)
        );
        if (!hasMatchingDepartment) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sort === "newest") {
        return b.year.localeCompare(a.year);
      }
      return a.year.localeCompare(b.year);
    });
  }, [groups, searchTerm, filter, activeFilters, sort]);

  const handleFilterChange = (newFilters: { year: string; departments: string[] }) => {
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({ year: "", departments: [] });
  };

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`https://yourwebsite.com/group/${id}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!showCreateGroup ? (
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
              </div>

              <div className="flex gap-8">
                <div className="w-1/4">
                  <Filter
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
                        startContent={<Search className="text-default-400" size={20} />}
                      />
                    </div>

                    <Button
                      color="primary"
                      startContent={<Plus size={20} />}
                      onClick={() => setShowCreateGroup(true)}
                    >
                      Create New Group
                    </Button>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <Button
                      className={`w-1/3 ${filter === "all" ? "bg-default-100" : ""}`}
                      variant={filter === "all" ? "flat" : "ghost"}
                      onClick={() => setFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      className={`w-1/3 ${filter === "active" ? "bg-success-100" : ""}`}
                      variant={filter === "active" ? "flat" : "ghost"}
                      onClick={() => setFilter("active")}
                    >
                      Active
                    </Button>
                    <Button
                      className={`w-1/3 ${filter === "archived" ? "bg-default-100" : ""}`}
                      variant={filter === "archived" ? "flat" : "ghost"}
                      onClick={() => setFilter("archived")}
                    >
                      Archived
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {filteredGroups.map((group) => (
                      <Card 
                      key={group.id} 
                      className="p-4 cursor-pointer w-full"
                      isPressable
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{group.name}</h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${group.status === "Active"
                                    ? "bg-success-100 text-success-600"
                                    : "bg-default-100 text-default-600"
                                  }`}
                              >
                                {group.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-default-500 mb-4">
                              <span>{group.year}</span>
                              <span>{group.studentCount} students</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {group.departments.map((dept) => (
                                <span
                                  key={dept.id}
                                  className="px-2 py-1 bg-default-100 rounded-full text-xs"
                                >
                                  {dept.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              variant="flat"
                              onClick={() => handleCopyLink(group.id)}
                            >
                              <Copy size={18} />
                            </Button>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button isIconOnly variant="flat">
                                  <MoreVertical size={18} />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem
                                  className="text-danger"
                                  color="danger"
                                  startContent={<Archive size={18} />}
                                >
                                  Archive
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="create-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-8">
                <Button
                  variant="light"
                  startContent={<ArrowLeft size={20} />}
                  onClick={() => setShowCreateGroup(false)}
                >
                  Back to Groups
                </Button>
              </div>
              <CreateGroupForm onClose={() => setShowCreateGroup(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlacementGroups;