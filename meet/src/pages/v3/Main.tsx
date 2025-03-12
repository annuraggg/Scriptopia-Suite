import {
  Call,
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
import { io, Socket } from "socket.io-client";

interface WaitingUser {
  id: string;
  name: string;
}

const SOCKET_URL = import.meta.env.VITE_API_URL!;
const socket: Socket = io(SOCKET_URL);

const Main = () => {
  const streamApiKey = import.meta.env.VITE_STREAM_API_KEY;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("lobby");

  const [serverToken, setServerToken] = useState("");
  const [streamToken, setStreamToken] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("guest");

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [waitingList, setWaitingList] = useState<WaitingUser[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  socket.on("meet/user-joined/callback", (data) => {
    if (role !== "interviewer") return;
    setWaitingList((prev) => [...prev, { id: data.userId, name: data.name }]);
    toast.success(`${data.name} is waiting to join the call`);
  });

  socket.on("meet/accept-user/callback", (data) => {
    if (role !== "candidate") return;
    if (data.userId !== userId) return;

    setIsReceivingCall(true);
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postingId = urlParams.get("id");
    axios
      .post("/meet", {
        postingId: postingId,
      })
      .then((res) => {
        setServerToken(res.data.data.token);
        setPage("lobby");
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const onJoin = () => {
    setLoading(true);
    axios
      .post("meet/stream", { token: serverToken })
      .then((res) => {
        setStreamToken(res.data.data.token);
        setRole(res.data.data.role);

        const { userId, name, token, role } = res.data.data;

        setupCall(userId, name, token, role as "interviewer" | "candidate");
      })
      .catch((err) => {
        toast.error(err.message || "An error occurred");
      })
      .finally(() => setLoading(false));
  };

  const joinCandidate = () => {
    setLoading(true);
    axios
      .post("meet/stream", { token: serverToken })
      .then((res) => {
        setStreamToken(res.data.data.token);
        setRole(res.data.data.role);

        const { userId, name, token, role } = res.data.data;

        console.log("Joining as candidate");
        console.log(userId, name, token, role);

        setupCall(userId, name, token, role as "interviewer" | "candidate");
      })
      .catch((err) => {
        toast.error(err.message || "An error occurred");
      })
      .finally(() => setLoading(false));
  };

  const setupCall = async (
    userId: string,
    name: string,
    userToken: string,
    role: "interviewer" | "candidate"
  ) => {
    try {
      const user: User = {
        id: userId,
        type: "authenticated",
        name: name,
      };

      const newClient = new StreamVideoClient({
        apiKey: streamApiKey,
        user,
        token: userToken,
        options: { timeout: 50000 },
      });

      setClient(newClient);

      const callId = window.location.pathname.split("/")[2];
      const callType = "interview";

      if (role === "interviewer") {
        const newCall = newClient.call(callType, callId);
        await newCall.getOrCreate();
        await newCall.join();

        setCall(newCall);
        setPage("meet");
      } else if (role === "candidate" && isReceivingCall) {
        const newCall = newClient.call(callType, callId);
        await newCall.getOrCreate();
        await newCall.join();

        setCall(newCall);
        setPage("meet");
      } else {
        setPage("waiting");
      }

      setUserId(userId);
      socket.emit("meet/user-joined", { token: serverToken });
    } catch (err) {
      console.error(err);
      toast.error("Failed to setup the call");
      throw err;
    }
  };

  const acceptParticipant = (userId: string) => {
    socket.emit("meet/accept-user", { userId, token: serverToken });
    toast.success("Waiting for candidate to answer the call");
  };

  if (loading) return <Loading />;

  if (page === "lobby") return <Lobby onJoin={onJoin} />;

  if (!client || !call)
    return (
      <Waiting isRinging={isReceivingCall} joinInterview={joinCandidate} />
    );

  if (page === "waiting")
    return (
      <Waiting isRinging={isReceivingCall} joinInterview={joinCandidate} />
    );

  if (page === "meet")
    return (
      <StreamVideo client={client!}>
        <StreamTheme>
          <StreamCall call={call}>
            <Meet
              call={call}
              client={client}
              waitingList={waitingList}
              acceptParticipant={acceptParticipant}
            />
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    );
};

export default Main;
