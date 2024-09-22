import Sidebar from "./Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Role } from "@shared-types/Organization";
import { Card, CardBody, Checkbox, Input, Spinner } from "@nextui-org/react";
import UnsavedToast from "@/components/UnsavedToast";
import { setToastChanges } from "@/reducers/toastReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types/Reducer";

const Roles = () => {
  const [builtInRoles, setBuiltInRoles] = useState<Role[]>([]);
  const [customRoles, setCustomRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<Role>({} as Role);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [changes, setChanges] = useState<boolean>(false);

  const [reset, setReset] = useState(false);

  const dispatch = useDispatch();

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const triggerSaveToast = () => {
    if (!changes) {
      setChanges(true);
      dispatch(setToastChanges(true));
    }
  };

  const org = useSelector((state: RootState) => state.organization);

  useEffect(() => {
    setLoading(true);
    axios
      .get("organizations/settings")
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
      .post("organizations/settings/roles", { roles: customRoles })
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
      slug: "new_role",
      description: "",
      permissions: [],
      default: false,
    };
    setCustomRoles([...customRoles, newRole]);
    setSelectedRole(newRole);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changePerm = (val: any, perm: any) => {
    if (selectedRole.default) return toast.error("Cannot edit built-in roles");
    setChanges(true);

    if (val) {
      setSelectedRole({
        ...selectedRole,
        permissions: [...selectedRole.permissions, perm],
      });
      setCustomRoles(
        customRoles.map((role) =>
          role.slug === selectedRole.slug
            ? {
                ...selectedRole,
                permissions: [...selectedRole.permissions, perm],
              }
            : role
        )
      );
    } else {
      setSelectedRole({
        ...selectedRole,
        permissions: selectedRole.permissions.filter((p) => p !== perm),
      });
      setCustomRoles(
        customRoles.map((role) =>
          role.slug === selectedRole.slug
            ? {
                ...selectedRole,
                permissions: selectedRole.permissions.filter((p) => p !== perm),
              }
            : role
        )
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

  const getWords = (str: string) => {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      <UnsavedToast action={save} reset={setReset} />
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
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
                        role.slug === selectedRole.slug
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
                        role.slug === selectedRole.slug
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
                      key={perm}
                      isSelected={selectedRole.permissions.includes(perm)}
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
