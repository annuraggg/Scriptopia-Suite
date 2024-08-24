import Sidebar from "./Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Role } from "@shared-types/EnterpriseRole";
import { Card, CardBody, Checkbox, Input, Spinner } from "@nextui-org/react";
import { Permission } from "@shared-types/EnterprisePermission";
import UnsavedToast from "@/components/UnsavedToast";
import { setToastChanges } from "@/reducers/toastReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types/Reducer";

const Roles = () => {
  const [builtInRoles, setBuiltInRoles] = useState<Role[]>([]);
  const [customRoles, setCustomRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<Role>({} as Role);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [changes, setChanges] = useState<boolean>(false);

  const [reset, setReset] = useState(false);

  const org = useSelector((state: RootState) => state.institute._id)!;

  const dispatch = useDispatch();

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const triggerSaveToast = () => {
    if (!changes) {
      setChanges(true);
      dispatch(setToastChanges(true));
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("campus/settings")
      .then((res) => {

        setBuiltInRoles(
          res.data.data.roles.filter((role: Role) => role.default)
        );
        setCustomRoles(
          res.data.data.roles.filter((role: Role) => !role.default)
        );

        setSelectedRole(
          res.data.data.roles.filter((role: Role) => role.default)[0]
        );

        setPermissions(res.data.data.permissions);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error Fetching Settings");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const save = async () => {
    setLoading(true);
    axios
      .post("campus/settings/roles", { roles: customRoles })
      .then(() => {
        toast.success("Roles Saved Successfully");
        setChanges(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error Saving Roles");
      })
      .finally(() => setLoading(false));
  };

  const newRole = () => {
    const newRole: Role = {
      name: "New Role",
      description: "",
      permissions: [],
      default: false,
      organization: org,
    };
    setCustomRoles([...customRoles, newRole]);
    setSelectedRole(newRole);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changePerm = (val: any, perm: any) => {
    if (selectedRole.default) return toast.error("Cannot edit built-in roles");
    setChanges(true);
    if (val) {
      const newRole = {
        ...selectedRole,

      };

      setSelectedRole(newRole);
      setCustomRoles(
        customRoles.map((role) => (role._id === newRole._id ? newRole : role))
      );
    } else {
      const newRole = {
        ...selectedRole,
        permissions: selectedRole.permissions.filter((p) => p !== perm._id),
      };

      setSelectedRole(newRole);
      setCustomRoles(
        customRoles.map((role) => (role._id === newRole._id ? newRole : role))
      );
    }

    triggerSaveToast();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <UnsavedToast action={save} reset={setReset} />
      <div className="mt-5 ml-5">
        <Breadcrumbs>
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
              {selectedRole.default && (
                <p className="text-red-500 mb-5">
                  Default Roles cannot be edited
                </p>
              )}
              <div>
                <p className="text-sm opacity-50 mb-2">Role Name</p>
                <Input
                  type="text"
                  isDisabled={selectedRole.default}
                  value={selectedRole.name}
                  onChange={(e) => {
                    setSelectedRole({ ...selectedRole, name: e.target.value });
                    setCustomRoles(
                      customRoles.map((role) =>
                        role._id === selectedRole._id
                          ? { ...selectedRole, name: e.target.value }
                          : role
                      )
                    );

                    triggerSaveToast();
                  }}
                />
              </div>
              <div>
                <p className="text-sm opacity-50 mt-5 mb-2">Role Description</p>
                <Input
                  isDisabled={selectedRole.default}
                  type="text"
                  value={selectedRole.description}
                  onChange={(e) => {
                    setSelectedRole({
                      ...selectedRole,
                      description: e.target.value,
                    });
                    setCustomRoles(
                      customRoles.map((role) =>
                        role._id === selectedRole._id
                          ? { ...selectedRole, description: e.target.value }
                          : role
                      )
                    );

                    triggerSaveToast();
                  }}
                />
              </div>

              <div className="mt-5">
                <p className="text-sm opacity-50">Permissions</p>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  {permissions.map((perm) => (
                    <Checkbox
                      isDisabled={selectedRole.default}
                      key={perm._id}
                      isSelected={
                        selectedRole.permissions.filter(
                          (p) => p === perm._id
                        ).length > 0
                      }
                      onValueChange={(val) => changePerm(val, perm)}
                    >
                      <p>{permissions.find((p) => p._id === perm._id)?.name}</p>
                      <p className="text-sm opacity-50">
                        {
                          permissions.find((p) => p._id === perm._id)
                            ?.description
                        }
                      </p>
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
