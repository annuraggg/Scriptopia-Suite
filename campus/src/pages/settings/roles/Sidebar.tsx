import { Role } from "@shared-types/Institute";
import { Button } from "@nextui-org/react";

const Sidebar = ({
  builtInRoles,
  customRoles,
  selectedRole,
  setSelectedRole,
  newRole,
}: {
  builtInRoles: Role[];
  customRoles: Role[];
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
  newRole: () => void;
}) => {
  return (
    <div className="h-full border min-w-[20%] max-w-[20%] rounded-xl bg-card py-5 px-5 truncate">
      <p className="text-sm opacity-50">Built in roles</p>
      <div className="flex flex-col gap-2 mt-5">
        {builtInRoles?.map((role) => (
          <div
            key={role._id}
            className={`${
              selectedRole?._id === role._id
                ? "bg-foreground text-background"
                : "hover:bg-accent/20"
            } flex flex-col gap-1 h-10 px-3 py-2 rounded-xl cursor-pointer transition-all overflow-hidden`}
            onClick={() => setSelectedRole(role)}
          >
            <p className="overflow-hidden text-ellipsis">{role.name}</p>
          </div>
        ))}
      </div>

      <p className="text-sm opacity-50 mt-7">Custom roles</p>
      <div className="flex flex-col gap-2 mt-5">
        {customRoles?.map((role, index) => (
          <div
            key={index}
            className={`flex flex-col h-10 gap-1 px-3 py-2 rounded-xl cursor-pointer transition-all overflow-hidden ${
              selectedRole?._id === role._id
                ? "bg-foreground text-background"
                : "hover:bg-accent/20 "
            }  `}
            onClick={() => setSelectedRole(role)}
          >
            <p className="overflow-hidden text-ellipsis">{role.name}</p>
          </div>
        ))}
        <Button className="mt-5" variant="light" onPress={newRole}>
          + Add Role
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
