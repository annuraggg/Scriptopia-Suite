import { Institute } from "@shared-types/Institute";

const getCampusUsersWithPermission = async ({
  institute,
  permissions,
}: {
  institute: any;
  permissions: string[];
}) => {
  const instituteWithType: Institute = institute as Institute;

  const roles = instituteWithType.roles.filter((role) =>
    role.permissions.some((permission) => permissions.includes(permission))
  );

  console.log("permissions", permissions);
  console.log("instituteWithType", instituteWithType.roles);
  console.log("roles", roles);

  const members = instituteWithType.members.filter((member) =>
    roles.some((role) => role.slug?.toString() === member.role.toString())
  );

  console.log("members", members);

  const users = members.map((member) => member?.user).filter(Boolean);
  return users;
};

export default getCampusUsersWithPermission;
