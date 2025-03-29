import ControlPanel from "@/pages/jobs_temp/ControlPanel";
import Myjobs from "@/pages/jobs_temp/Myjobs";
import Interviews from "@/pages/jobs_temp/Interviews";

const jobRoutes = [
    { path: "", element: <ControlPanel /> },
    { path: "myjobs", element: <Myjobs /> },
    { path: "interviews", element: <Interviews /> }
]

export default jobRoutes;