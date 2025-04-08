import Sidebar from "./Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Role } from "@shared-types/Institute";
import { Card, CardBody } from "@heroui/react";
import { Input } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { useOutletContext } from "react-router-dom";
import { SettingsContext } from "@/types/SettingsContext";

const permissions = [
  "manage_drive",
  "view_drive",
  "verify_candidates",
  "view_institute",
  "manage_institute",
  "view_billing",
  "manage_billing",
];

const Roles = () => {
  const [builtInRoles, setBuiltInRoles] = useState<Role[]>([]);
  const [customRoles, setCustomRoles] = useState<Role[]>([]);

  const [selectedRole, setSelectedRole] = useState<Role>({} as Role);

  const { institute, setInstitute, rerender } =
    useOutletContext() as SettingsContext;

  useEffect(() => {
    if (!institute?.roles) return;
    setBuiltInRoles(institute?.roles?.filter((role) => role.default));
    setCustomRoles(institute?.roles?.filter((role) => !role.default));
    setSelectedRole(institute?.roles?.filter((role) => role.default)[0]);
  }, [rerender]);

  const newRole = () => {
    const newRole: Role = {
      name: "New Role",
      slug: "new_role",
      description: "",
      permissions: [],
      default: false,
    };
    setCustomRoles([...customRoles, newRole]);
    setSelectedRole(newRole);

    const newInstitute = { ...institute };
    newInstitute.roles = [...(newInstitute.roles || []), newRole];
    setInstitute(newInstitute);
  };

  const changePerm = (val: boolean, perm: string) => {
    if (selectedRole?.default) return toast.error("Cannot edit built-in roles");

    const newInstitute = { ...institute };
    newInstitute.roles = newInstitute.roles?.map((role) =>
      role.slug === selectedRole.slug
        ? {
            ...selectedRole,
            permissions: val
              ? [...selectedRole.permissions, perm]
              : selectedRole.permissions?.filter((p) => p !== perm),
          }
        : role
    );

    setInstitute(newInstitute);
    setSelectedRole({
      ...selectedRole,
      permissions: val
        ? [...selectedRole.permissions, perm]
        : selectedRole.permissions?.filter((p) => p !== perm),
    });
  };

  const getWords = (str: string) => {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{institute?.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/roles"}>Roles</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="flex p-5 items-center h-[94vh] gap-5 ">
        <Sidebar
          builtInRoles={builtInRoles}
          customRoles={customRoles}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          newRole={newRole}
        />
        <Card className="h-full w-full">
          <CardBody className="px-5">
            <div className="mt-5">
              {selectedRole?.default && (
                <p className="text-red-500 mb-5">
                  Default Roles cannot be edited
                </p>
              )}
              <div>
                <p className="text-sm opacity-50 mb-2">Role Name</p>
                <Input
                  type="text"
                  isDisabled={selectedRole?.default}
                  value={selectedRole?.name}
                  onChange={(e) => {
                    const newInstitute = { ...institute };
                    newInstitute.roles = newInstitute.roles?.map((role) =>
                      role.slug === selectedRole.slug
                        ? { ...selectedRole, name: e.target.value }
                        : role
                    );
                    setInstitute(newInstitute);
                    setSelectedRole({
                      ...selectedRole,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <p className="text-sm opacity-50 mt-5 mb-2">Role Description</p>
                <Input
                  isDisabled={selectedRole?.default}
                  type="text"
                  value={selectedRole?.description}
                  onChange={(e) => {
                    const newInstitute = { ...institute };
                    newInstitute.roles = newInstitute.roles?.map((role) =>
                      role.slug === selectedRole.slug
                        ? { ...selectedRole, description: e.target.value }
                        : role
                    );
                    setInstitute(newInstitute);
                    setSelectedRole({
                      ...selectedRole,
                      description: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="mt-5">
                <p className="text-sm opacity-50">Permissions</p>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  {permissions?.map((perm) => (
                    <Checkbox
                      isDisabled={selectedRole?.default}
                      key={perm}
                      isSelected={selectedRole?.permissions?.includes(perm)}
                      onValueChange={(val) => changePerm(val, perm)}
                    >
                      <p className="text-sm opacity-50">{getWords(perm)}</p>
                    </Checkbox>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Roles;
