const defaultOrganizationRoles = [
  {
    name: "Administrator",
    slug: "administrator",
    default: true,
    description: "Administrator role",
    permissions: [
      "manage_job",
      "view_job",
      "view_organization",
      "manage_organization",
      "view_billing",
      "manage_billing",
      "view_analytics",
      "interviewer",
    ],
  },

  {
    name: "Read Only",
    slug: "read_only",
    default: true,
    description: "Read Only role",
    permissions: [
      "view_job",
      "view_organization",
      "view_billing",
      "view_analytics",
    ],
  },

  {
    name: "Finance",
    slug: "finance",
    default: true,
    description: "Finance role",
    permissions: ["view_billing", "manage_billing"],
  },

  {
    name: "Hiring Manager",
    slug: "hiring_manager",
    default: true,
    description: "Hiring Manager role",
    permissions: ["manage_job", "view_job"],
  },
];

export default defaultOrganizationRoles;
