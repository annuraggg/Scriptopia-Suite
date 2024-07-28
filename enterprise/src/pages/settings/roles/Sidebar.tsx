import Role from "@/@types/Roles";
import { Button } from "@nextui-org/react";

const Sidebar = ({
  builtInRoles,
  customRoles,
}: {
  builtInRoles: Role[];
  customRoles: Role[];
}) => {
  return (
    <div className="h-[85vh] border w-[20%] rounded-xl bg-card py-5 px-5">
      <p className="text-sm opacity-50">Built in roles</p>
      <div className="flex flex-col gap-2 mt-5">
        {builtInRoles?.map((role) => (
          <div
            key={role._id}
            className="flex flex-col gap-1 px-3 py-2 rounded-xl hover:bg-gray-800 cursor-pointer transition-all "
          >
            <p>{role.name}</p>
          </div>
        ))}
      </div>

      <p className="text-sm opacity-50 mt-7">Custom roles</p>
      <div className="flex flex-col gap-2 mt-5">
        {customRoles?.map((role) => (
          <div
            key={role._id}
            className="flex flex-col gap-1 px-3 py-2 rounded-xl hover:bg-gray-800 cursor-pointer transition-all "
          >
            <p>{role.name}</p>
          </div>
        ))}
        <Button className="mt-5" variant="light">
          + Add Role
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
