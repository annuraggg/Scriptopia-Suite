import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Card, CardBody, Button, Tabs, Tab } from "@nextui-org/react";
import { Link } from "lucide-react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { RootContext } from "@/types/RootContext";
import { DataTable } from "./DataTable";
import { ExtendedPlacementGroup } from "@shared-types/ExtendedPlacementGroup";

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const { institute } = useOutletContext<RootContext>();

  const [group, setGroup] = useState<ExtendedPlacementGroup | null>(null);
  const [selected, setSelected] = useState("details");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`/placement-groups/${id}`)
      .then((res) => {
        setGroup(res.data.data);
      })
      .catch((err) => {
        toast.error("Error fetching group details");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (!group) {
    return (
      <div className="flex items-center justify-center h-screen">
        Placement Group not found
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex items-center justify-between p-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {group.name}
        </h1>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {group.stats.map((stat, index) => (
          <Card key={index} className="bg-default-50">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <stat.icon size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-small text-default-500">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <Chip
                    size="sm"
                    color={stat.trend === "up" ? "success" : "danger"}
                    variant="flat"
                    className="text-xs"
                  >
                    {stat.change}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div> */}

      {/* Tabs */}
      <Tabs
        selectedKey={selected}
        onSelectionChange={setSelected as any}
        variant="underlined"
        color="primary"
      >
        {/* Group Details Tab */}
        <Tab key="details" title="Group Details">
          <div className="space-y-6 mt-5">
            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">
                  Group Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Group Name</p>
                    <p className="text-base font-medium">{group.name}</p>
                  </div>

                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">
                      College Batch
                    </p>
                    <p className="text-base font-medium">
                      {group.academicYear.start} - {group.academicYear.end}
                    </p>
                  </div>

                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">
                      Department(s)
                    </p>
                    <p className="text-base font-medium">
                      {group.departments.map((d) => (
                        <p>
                          {
                            institute.departments.find((dept) => dept._id === d)
                              ?.name
                          }
                        </p>
                      ))}
                    </p>
                  </div>

                  <div className="mx-2 md:col-span-2">
                    <p className="text-sm text-default-500 mb-1">
                      Group Purpose
                    </p>
                    <p className="text-base font-medium">{group.purpose}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Group Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">
                      Group Expiry Date & Time
                    </p>
                    <p className="text-base font-medium">
                      {new Date(group.expiryDate).toDateString()}
                    </p>
                  </div>

                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Access Type</p>
                    <p className="text-base font-medium">
                      {group.accessType.slice(0, 1).toUpperCase() +
                        group.accessType.slice(1)}
                    </p>
                  </div>

                  <div className="mx-2 md:col-span-2">
                    <p className="text-sm text-default-500 mb-1">Invite Link</p>
                    <div className="flex gap-2 items-center">
                      <div className="flex items-center gap-2 border rounded-md p-2 bg-default-100 max-w-lg">
                        <Link size={16} className="text-default-500" />
                        <p className="text-sm truncate">
                          {import.meta.env.VITE_CANDIDATE_URL}
                          /campus/placement-groups/join/${group._id}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => {
                          window.navigator.clipboard.writeText(
                            `${
                              import.meta.env.VITE_CANDIDATE_URL
                            }/campus/placement-groups/join/${group._id}`
                          );

                          toast.success("Link copied to clipboard!");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Additional sections can continue below if needed */}
            {/* <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">
                  Participating Companies
                </h3>
                <div className="space-y-3">
                  {group.companies.map((company) => (
                    <Card
                      key={company.id}
                      className="border border-default-200"
                    >
                      <CardBody className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{company.name}</p>
                            <p className="text-small text-default-500">
                              {company.industry}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-small text-default-500">
                                Openings
                              </p>
                              <p className="font-semibold">
                                {company.openings}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-small text-default-500">
                                Package
                              </p>
                              <p className="font-semibold">{company.package}</p>
                            </div>
                            <Button size="sm" variant="flat" color="primary">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Button variant="light" color="primary">
                    View All Companies
                  </Button>
                </div>
              </CardBody>
            </Card> */}
          </div>
        </Tab>

        <Tab key="students" title="Student Details">
          <DataTable data={group.candidates} />
        </Tab>
      </Tabs>
    </motion.div>
  );
};

export default GroupDetails;
