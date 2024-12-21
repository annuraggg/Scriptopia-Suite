import Myjobs from "@/pages/Jobs/Myjobs";
import ControlPanel from "@/pages/Jobs/ControlPanel";
import Interviews from "@/pages/Jobs/Interviews";

const jobRoutes = [
    { path: "", element: <ControlPanel /> },
    { path: "myjobs", element: <Myjobs /> },
    { path: "interviews", element: <Interviews /> }
]

export default jobRoutes;