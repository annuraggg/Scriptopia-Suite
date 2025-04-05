const defaultInstituteRoles = [
  {
    name: "administrator",
    default: true,
    description: "Administrator role",
    permissions: [
      "manage_drive",
      "view_drive",
      "verify_candidates",
      "view_institute",
      "manage_institute",
      "view_billing",
      "manage_billing",
    ],
  },

  {
    name: "Read Only",
    default: true,
    description: "Read Only role",
    permissions: [
      "view_drive",
      "view_institute",
      "view_billing",
    ],
  },

  {
    name: "Finance",
    default: true,
    description: "Finance role",
    permissions: ["view_billing", "manage_billing"],
  },

  {
    name: "Drive Manager",
    default: true,
    description: "Drive Manager role",
    permissions: ["manage_drive", "view_drive"],
  },
  {
    name: "Profile Verification Officer",
    default: true,
    description: "Profile Verification Officer role",
    permissions: ["verify_candidates", "view_candidates"],
  },
];

export default defaultInstituteRoles;