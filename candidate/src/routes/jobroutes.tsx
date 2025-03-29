import ControlPanel from "@/pages/jobs/ControlPanel";
import Myjobs from "@/pages/jobs/Myjobs";
import Interviews from "@/pages/jobs/Interviews";

const jobRoutes = [
    { path: "", element: <ControlPanel /> },
    { path: "myjobs", element: <Myjobs /> },
    { path: "interviews", element: <Interviews /> }
]

export default jobRoutes;