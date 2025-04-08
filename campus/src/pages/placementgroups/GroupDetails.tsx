import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
} from "@nextui-org/react";
import { Link, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { RootContext } from "@/types/RootContext";
import { DataTable } from "./DataTable";
import { ExtendedPlacementGroup } from "@shared-types/ExtendedPlacementGroup";
import { PlacementGroupRule } from "@shared-types/PlacementGroup";

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const { institute } = useOutletContext<RootContext>();

  const [group, setGroup] = useState<ExtendedPlacementGroup | null>(null);
  const [selected, setSelected] = useState("details");
  const [loading, setLoading] = useState(true);

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

  const getCategoryFriendlyName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      education: "Education",
      academics: "Academic Performance",
      skills: "Skills",
      experience: "Work Experience",
      profile: "Profile Information",
      demographics: "Demographics",
      personal: "Personal Details",
    };
    return categoryMap[category.toLowerCase()] || category;
  };

  const getOperatorDescription = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      eq: "is equal to",
      neq: "is not equal to",
      gt: "is greater than",
      gte: "is at least",
      lt: "is less than",
      lte: "is at most",
      in: "is one of",
      nin: "is not one of",
      contains: "contains",
      startswith: "starts with",
      endswith: "ends with",
    };
    return operatorMap[operator] || operator;
  };

  const formatCriterion = (rule: PlacementGroupRule): string => {
    let valueDisplay = rule.value;

    if (Array.isArray(rule.value)) {
      valueDisplay = rule.value.join(", ");
    } else if (typeof rule.value === "boolean") {
      valueDisplay = rule.value ? "Yes" : "No";
    }

    return `${rule.subcategory} ${getOperatorDescription(
      rule.operator
    )} ${valueDisplay}`;
  };

  const getCriteriaByCategory = (): Record<string, PlacementGroupRule[]> => {
    if (!group?.criteria || group.criteria.length === 0) return {};

    return group.criteria.reduce(
      (acc: Record<string, PlacementGroupRule[]>, rule) => {
        const category = rule.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(rule);
        return acc;
      },
      {}
    );
  };

  if (loading) return <Loader />;

  if (!group) {
    return (
      <div className="flex items-center justify-center h-screen">
        Placement Group not found
      </div>
    );
  }

  const criteriaByCategory = getCriteriaByCategory();
  const hasCriteria = Object.keys(criteriaByCategory).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex items-center justify-between p-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {group.name}
        </h1>
      </div>

      <Tabs
        selectedKey={selected}
        onSelectionChange={setSelected as any}
        variant="underlined"
        color="primary"
      >
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
                    <div>
                      {group.departments.map((d) => (
                        <p key={d} className="text-base font-medium">
                          {
                            institute.departments.find((dept) => dept._id === d)
                              ?.name
                          }
                        </p>
                      ))}
                    </div>
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
                <h3 className="text-xl font-semibold mb-4">
                  Eligibility Criteria
                </h3>

                {hasCriteria ? (
                  <div className="space-y-6">
                    {Object.entries(criteriaByCategory).map(
                      ([category, rules], idx) => (
                        <div key={idx} className="space-y-2">
                          <h4 className="text-md font-medium text-primary">
                            {getCategoryFriendlyName(category)}
                          </h4>
                          <div className="pl-2 border-l-2 border-primary/30 space-y-2">
                            {rules.map((rule, ruleIdx) => (
                              <div
                                key={ruleIdx}
                                className="flex items-center gap-2"
                              >
                                <p className="text-sm text-default-700">
                                  {formatCriterion(rule)}
                                </p>
                                {rule.type && (
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    color={
                                      rule.type.toLowerCase() === "optional"
                                        ? "warning"
                                        : "primary"
                                    }
                                    className="text-xs"
                                  >
                                    {rule.type}
                                  </Chip>
                                )}
                              </div>
                            ))}
                          </div>
                          {idx < Object.keys(criteriaByCategory).length - 1 && (
                            <Divider className="my-2" />
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-default-500">
                    <AlertCircle size={18} />
                    <p>
                      No specific eligibility criteria set for this placement
                      group.
                    </p>
                  </div>
                )}
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

                  <div className="mx-2 md:col-span-2">
                    <p className="text-sm text-default-500 mb-1">Invite Link</p>
                    <div className="flex gap-2 items-center">
                      <div className="flex items-center gap-2 border rounded-md p-2 bg-default-100 max-w-lg">
                        <Link size={16} className="text-default-500" />
                        <p className="text-sm truncate">
                          {import.meta.env.VITE_CANDIDATE_URL}
                          /campus/placement-groups/join/{group._id}
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
