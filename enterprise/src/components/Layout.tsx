import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="flex gap-5 h-full">
        <Sidebar />
      </div>
    </div>
  );
};

export default Layout;
