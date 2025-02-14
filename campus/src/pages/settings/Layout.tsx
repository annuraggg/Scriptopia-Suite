import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import { RootContext } from "@/types/RootContext";
import { useEffect, useState } from "react";
import UnsavedToast from "@/components/UnsavedToast";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast as sonner } from "sonner";
import { InstituteWithDrives as IWD } from "@/types/RootContext";

const Layout = () => {
  const { institute, setInstitute, user } =
    useOutletContext() as RootContext;

  const [toast, setToast] = useState<boolean>(false);
  const [shakeToast, setShakeToast] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [newOrganization, setNewOrganization] = useState<IWD>({} as IWD);

  useEffect(() => {
    setNewOrganization(institute);
    setRerender(!rerender);
  }, [institute]);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const action = () => {
    setToast(false);
    console.log(newOrganization);
    axios
      .put("institutes", newOrganization)
      .then(() => {
        setInstitute(newOrganization);
        sonner.success("Saved", { position: "top-right" });
      })
      .catch((err) => {
        sonner.error("Error updating institute. Please try again.");
        console.error(err);
      });
  };

  const reset = () => {
    setToast(false);
    setNewOrganization(institute);
    setRerender(!rerender);
  };

  const handleToast = (toast: boolean, newOrganization?: IWD) => {
    setToast(toast);
    if (newOrganization) setNewOrganization(newOrganization);
  };

  const updateLocalOrganization = (newOrganization: IWD) => {
    setNewOrganization(newOrganization);
    setToast(true);
  };

  return (
    <div className="">
      <div className="flex w-full">
        <Sidebar toast={toast} shakeToast={setShakeToast} />
        <div className="h-full w-full overflow-x-auto">
          <Outlet
            context={{
              institute: newOrganization,
              setInstitute: updateLocalOrganization,
              setToast: handleToast,
              toast,
              rerender,
              user,
            }}
          />
        </div>
        {toast && (
          <UnsavedToast action={action} reset={reset} shake={shakeToast} />
        )}
      </div>
    </div>
  );
};

export default Layout;
