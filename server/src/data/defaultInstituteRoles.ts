const defaultInstituteRoles = [
  {
    name: "administrator",
    slug: "administrator",
    default: true,
    description: "Administrator role",
    permissions: [
      "manage_drive",
      "view_drive",
      "verify_candidate",
      "view_institute",
      "manage_institute",
      "view_billing",
      "manage_billing",
    ],
  },

  {
    name: "read_only",
    slug: "read_only",
    default: true,
    description: "Read Only role",
    permissions: [
      "view_drive",
      "view_institute",
      "view_billing",
    ],
  },

  {
    name: "finance",
    slug: "finance",
    default: true,
    description: "Finance role",
    permissions: ["view_billing", "manage_billing"],
  },

  {
    name: "drive_manager",
    slug: "drive_manager",
    default: true,
    description: "Drive Manager role",
    permissions: ["manage_drive", "view_drive"],
  },

  {
    name: "employer",
    slug: "employer",
    default: true,
    description: "Employer role",
    permissions: ["hire_candidate", "verify_hiring"],
  },
];

export default defaultInstituteRoles;