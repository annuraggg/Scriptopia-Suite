import ax from "@/config/axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
} from "@nextui-org/react";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const bgStyle = {
  backgroundImage: "url(./join-bg.svg)",
  backgroundSize: "cover",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(100px)",
};

const Join = () => {
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user, isLoaded } = useUser();

  const { getToken } = useAuth();
  useEffect(() => {
    const axios = ax(getToken);
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    axios
      .post("/organizations/verify", { token })
      .then(() => setLoading(false))
      .catch((err) => {
        console.error(err);
        toast.error("Invalid Invite");
      });
  }, []);

  return (
    <div
      style={bgStyle}
      className={`${loading ? "opacity-50" : ""} transition-all`}
    >
      <div>
        {!isSignedIn || !isLoaded || loading ? (
          <CircularProgress />
        ) : (
          <Card>
            <CardHeader className="justify-center">
              Organization Invite
            </CardHeader>
            <CardBody className="items-center px-10 w-[30vw]">
              <div className="flex gap-5 items-center">
                <Avatar src={user?.imageUrl} size="lg" />
                <Link />
                <Avatar size="lg" />
              </div>
              <p className="mt-5 opacity-50">Anurag has invited you to join</p>
              <h3 className="mt-3">Quebecia</h3>
            </CardBody>
            <CardFooter>
              <Button className="w-full mr-2" color="danger" variant="flat">
                Decline
              </Button>
              <Button className="w-full" color="success" variant="flat">
                Join
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Join;
