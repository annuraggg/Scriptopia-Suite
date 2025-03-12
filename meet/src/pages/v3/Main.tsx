import {
  Call,
  CallRequest,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import Lobby from "./Lobby";
import Meet from "./call/Meet";
import { toast } from "sonner";
import Waiting from "./Waiting";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import Loading from "./Loading";

const Main = () => {
  const streamApiKey = import.meta.env.VITE_STREAM_API_KEY;
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .post("/meet")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return <Lobby />;
};

export default Main;
