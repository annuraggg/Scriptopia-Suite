import Sidebar from "./Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Role from "@/@types/Roles";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Spinner,
} from "@nextui-org/react";
import Permission from "@/@types/Permission";
import UnsavedToast from "@/components/UnsavedToast";
import { setToastChanges } from "@/reducers/toastReducer";
import { useDispatch } from "react-redux";

const Roles = () => {
  const [builtInRoles, setBuiltInRoles] = useState<Role[]>([]);
  const [customRoles, setCustomRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<Role>({} as Role);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [changes, setChanges] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const triggerSaveToast = () => {
    if (!changes) {
      dispatch(setToastChanges(true));
    }
  };

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const save = async () => {};

  return (
    <div>
      <UnsavedToast action={save} />
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
        />
        <Card className="h-full w-full">
          <CardBody className="px-5">
            <div className="flex justify-between items-center">
              <h4>Role Details</h4>
              <Button
                color="success"
                variant="flat"
                isDisabled={selectedRole.default}
              >
                Save
              </Button>
            </div>
            <div className="mt-5">
              <div>
                <p className="text-sm opacity-50">Role Name</p>
                <Input
                  type="text"
                  value={selectedRole.name}
                  onChange={(e) =>
                    setSelectedRole({ ...selectedRole, name: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-sm opacity-50 mt-5">Role Description</p>
                <Input
                  type="text"
                  value={selectedRole.description}
                  onChange={(e) => {
                    setSelectedRole({
                      ...selectedRole,
                      description: e.target.value,
                    });
                    triggerSaveToast();
                  }}
                />
              </div>

              <div className="mt-5">
                <p className="text-sm opacity-50">Permissions</p>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  {permissions.map((perm) => (
                    <Checkbox
                      key={perm._id}
                      isSelected={
                        selectedRole.permissions.filter(
                          (p) => p._id === perm._id
                        ).length > 0
                      }
                      onValueChange={(val) => {
                        if (val) {
                          setSelectedRole({
                            ...selectedRole,
                            permissions: [
                              ...selectedRole.permissions,
                              { _id: perm._id, name: perm.name },
                            ],
                          });
                        } else {
                          setSelectedRole({
                            ...selectedRole,
                            permissions: selectedRole.permissions.filter(
                              (p) => p._id !== perm._id
                            ),
                          });
                        }

                        triggerSaveToast();
                      }}
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
