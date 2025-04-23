import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import { useEffect, useState, useCallback } from "react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { MemberWithPermission as MWP } from "@shared-types/MemberWithPermission";
import { Menu } from "lucide-react";
import { Button } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { ExtendedInstitute } from "@shared-types/ExtendedInstitute";
import { Notification } from "@shared-types/Notification";

const Layout = () => {
  const [notifications, setNotificationsState] = useState<Notification[]>([]);
  const [institute, setInstitute] = useState<ExtendedInstitute>(
    {} as ExtendedInstitute
  );
  const [user, setUser] = useState<MWP>({} as MWP);
  const [rerender, setRerender] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const setNotifications = useCallback(
    (updatedNotifications: Notification[], notificationId: string) => {
      setNotificationsState(updatedNotifications);

      const newlyReadNotification = updatedNotifications.find(
        (notification) => notification._id === notificationId
      );

      console.log("Newly read notification:", newlyReadNotification);
      if (newlyReadNotification) {
        axios
          .post(`/users/notifications/${newlyReadNotification._id}`)
          .catch((error) => {
            console.error("Error marking notification as read:", error);
            toast.error("Failed to mark notification as read");
          });
      }
    },
    [notifications, user._id, axios]
  );
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    axios
      .get("/institutes")
      .then((res) => {
        setInstitute(res.data.data.institute);
        setUser(res.data.data.user);
        console.log(res.data.data.institute);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          return (window.location.href = "/onboarding");
        }
        toast;
        toast.error(err.response.data.message || "An error occurred");
      })
      .finally(() => {
        setRerender(!rerender);
      });

    axios.get("/users/notifications?platform=campus").then((res) => {
      console.log(res.data.data);
      setNotificationsState(res.data.data);
    });
  }, []);

  const updateInstitute = (newInstitute: ExtendedInstitute) => {
    setInstitute(newInstitute);
    setRerender(!rerender);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <SignedIn>
        <div className="relative min-h-screen bg-background">
          {/* Mobile Header */}
          <div className="sm:hidden fixed top-0 left-0 right-0 h-16 border-b z-40 px-5 flex items-center justify-between">
            <img
              src="/logo.svg"
              alt="logo"
              className="h-6 cursor-pointer"
              onClick={() => {
                window.location.href = "/";
              }}
            />
            <Button
              isIconOnly
              variant="light"
              onClick={toggleMobileMenu}
              className="pr-4"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex w-full">
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 sm:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {(!isMobile || isMobileMenuOpen) && (
                <motion.div
                  key="sidebar"
                  initial={isMobile ? { x: -320 } : false}
                  animate={{ x: 0 }}
                  exit={isMobile ? { x: -320 } : undefined}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  className={`${isMobile ? "fixed" : "relative"} z-50`}
                >
                  <Sidebar
                    notifications={
                      notifications?.filter(
                        (n) => !n.readBy?.includes(user?.user!)
                      )?.length
                    }
                    institute={institute}
                    user={user}
                    isMobile={isMobile}
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`flex-1 min-h-screen bg-background max-h-screen overflow-y-auto ${
                isMobile ? "pt-16" : "px-5"
              }`}
            >
              <Outlet
                context={{
                  notifications,
                  setNotifications, // Use our custom function that sends POST requests
                  user,
                  institute,
                  setInstitute: updateInstitute,
                  rerender,
                }}
              />
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Layout;
