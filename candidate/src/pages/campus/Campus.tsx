import RootContext from "@/types/RootContext";
import { useOutletContext } from "react-router-dom";
import InstituteOnboarding from "./InstituteOnboarding";

const Campus = () => {
  const { user } = useOutletContext<RootContext>();

  if (!user?.institute) return <InstituteOnboarding />

  return (
    <div>
      Ins:
      {user?.institute}
    </div>
  );
};

export default Campus;
