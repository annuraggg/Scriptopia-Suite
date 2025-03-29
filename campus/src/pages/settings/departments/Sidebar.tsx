import { Department } from "@shared-types/Institute";
import { Button } from "@nextui-org/react";

const Sidebar = ({ departments }: { departments: Department[] }) => {
  return (
    <div className="h-[85vh] border w-full rounded-xl bg-card py-5 px-5">
      <p className="text-sm opacity-50">Your departments</p>
      <div className="flex flex-col gap-2 mt-5">
        {departments?.map((role) => (
          <div
            key={role._id}
            className="flex flex-col gap-1 px-3 py-2 rounded-xl border hover:bg-gray-800 cursor-pointer transition-all "
          >
            <p className="text-sm">
              {role.name} - {role.description}
            </p>
          </div>
        ))}
      </div>

      <Button className="mt-5" variant="light">
        + Add Department
      </Button>
    </div>
  );
};

export default Sidebar;
