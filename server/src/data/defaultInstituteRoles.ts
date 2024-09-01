const defaultInstituteRoles = [
  {
    name: "administrator",
    default: true,
    description: "Administrator role",
    permissions: [
      "manage_drive",
      "view_drive",
      "verify_details",
      "view_institute",
      "manage_institute",
      "view_billing",
      "manage_billing",
      "verify_hiring",
      "hire_candidate",
    ],
  },

  {
    name: "read_only",
    default: true,
    description: "Read Only role",
    permissions: [
      "view_drive",
      "view_institute",
      "view_billing",
      "verify_hiring",
    ],
  },

  {
    name: "finance",
    default: true,
    description: "Finance role",
    permissions: ["view_billing", "manage_billing"],
  },

  {
    name: "drive_manager",
    default: true,
    description: "Drive Manager role",
    permissions: ["manage_drive", "view_drive"],
  },

  {
    name: "employer",
    default: true,
    description: "Employer role",
    permissions: ["hire_candidate", "verify_hiring"],
  },
];

export default defaultInstituteRoles;