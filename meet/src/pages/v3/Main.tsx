import {
  Call,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState, useRef } from "react";
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
  socketId: string;
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
  const [waitingList, setWaitingList] = useState(new Set<WaitingUser>());
  ``;
  // Store pending promises to resolve them when users answer calls
  const pendingCallPromises = useRef<
    Record<
      string,
      { resolve: (value?: unknown) => void; reject: (reason?: any) => void }
    >
  >({});

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    const handleUserJoined = (data: any) => {
      if (role !== "interviewer") return;

      console.log(waitingList);
      console.log(data.decoded.userId);
      if (Array.from(waitingList).some((obj) => obj.id === data.decoded.userId))
        return;

      setWaitingList((prevWaitingList) => {
        const newWaitingList = new Set(prevWaitingList);
        newWaitingList.add({
          id: data.decoded.userId,
          name: data.decoded.name,
          socketId: data.socketId,
        });

        toast.info(`${data.decoded.name} is waiting to join the call`);
        return newWaitingList;
      });
    };

    const handleAcceptUser = (data: any) => {
      if (role !== "candidate") return;
      if (data.userId !== userId) return;

      setIsReceivingCall(true);
    };

    const handleUserLeft = (data: any) => {
      console.log("User left", data);
      console.log(waitingList);
      setWaitingList((prevWaitingList) => {
        const newWaitingList = new Set(prevWaitingList);
        const user = Array.from(newWaitingList).find(
          (obj) => obj.socketId === data.socketId
        );

        if (!user) return newWaitingList;

        newWaitingList.delete(user);
        return newWaitingList;
      }); 
    };

    const handleUserAnsweredCall = (data: any) => {
      console.log("User answered call", data);
      if (role !== "interviewer") return;

      // Resolve the promise for this user if it exists
      if (pendingCallPromises.current[data.userId]) {
        pendingCallPromises.current[data.userId].resolve();
        delete pendingCallPromises.current[data.userId];
      }

      setWaitingList((prevWaitingList) => {
        const newWaitingList = new Set(prevWaitingList);
        const user = Array.from(newWaitingList).find(
          (obj) => obj.id === data.userId
        );

        if (!user) return newWaitingList;

        newWaitingList.delete(user);
        return newWaitingList;
      });
    };

    const interviewerJoined = () => {
      if (role === "interviewer") return;
      socket.emit("meet/user-joined", { token: serverToken });
    };

    socket.on("meet/user-joined/callback", handleUserJoined);
    socket.on("meet/accept-user/callback", handleAcceptUser);
    socket.on("meet/user-left/callback", handleUserLeft);
    socket.on("meet/user-answered-call/callback", handleUserAnsweredCall);
    socket.on("meet/interviewer-joined", interviewerJoined);

    return () => {
      socket.off("meet/user-joined/callback", handleUserJoined);
      socket.off("meet/accept-user/callback", handleAcceptUser);
      socket.off("meet/user-left/callback", handleUserLeft);
      socket.off("meet/user-answered-call/callback", handleUserAnsweredCall);
      socket.off("meet/interviewer-joined", interviewerJoined);
    };
  }, [role, userId, waitingList, serverToken]);

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

  const onJoin = async () => {
    setLoading(true);
    axios
      .post("meet/stream", { token: serverToken })
      .then(async (res) => {
        setStreamToken(res.data.data.token);
        setRole(res.data.data.role);

        const { userId, name, token, role } = res.data.data;

        await setupCall(
          userId,
          name,
          token,
          role as "interviewer" | "candidate"
        );
      })
      .catch((err) => {
        toast.error(err.message || "An error occurred");
      })
      .finally(() => setLoading(false));
  };

  const joinCandidate = async () => {
    setLoading(true);
    axios
      .post("meet/stream", { token: serverToken })
      .then(async (res) => {
        setStreamToken(res.data.data.token);
        setRole(res.data.data.role);

        const { userId, name, token, role } = res.data.data;

        await setupCall(
          userId,
          name,
          token,
          role as "interviewer" | "candidate"
        );
        socket.emit("meet/user-answered-call", { token: serverToken });
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
    setLoading(true);
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

        socket.emit("meet/user-joined", { token: serverToken });
        setLoading(false);
      } else if (role === "candidate" && isReceivingCall) {
        const newCall = newClient.call(callType, callId);
        await newCall.getOrCreate();
        await newCall.join();

        setCall(newCall);
        setPage("meet");
      } else {
        socket.emit("meet/user-joined", { token: serverToken });
        setPage("waiting");
      }

      setUserId(userId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to setup the call");
      throw err;
    }
  };

  const acceptParticipant = (userId: string) => {
    socket.emit("meet/accept-user", { userId, token: serverToken });

    const callPromise = new Promise((resolve, reject) => {
      pendingCallPromises.current[userId] = { resolve, reject };

      // Set timeout to automatically reject if the user doesn't answer
      setTimeout(() => {
        if (pendingCallPromises.current[userId]) {
          pendingCallPromises.current[userId].reject();
          delete pendingCallPromises.current[userId];
        }
      }, 30000);
    });

    toast.promise(callPromise, {
      loading: "Calling User",
      success: "User received the call",
      error: "User did not receive the call.",
    });
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
