import {
  Call,
  CallRequest,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import Lobby from "./Lobby";
import Meet from "./call/Meet";
import { toast } from "sonner";
import Waiting from "./Waiting";

const Main = () => {
  const streamApiKey = import.meta.env.VITE_STREAM_API_KEY;
  const [call, setCall] = useState<Call | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [waitForRing, setWaitForRing] = useState(false);

  const meeting: CallRequest = {
    members: [{ user_id: "AbdulHadi", role: "interviewee" }],
  };

  const setupCall = async (
    userId: string,
    userToken: string,
    role: "host" | "guest"
  ) => {
    try {
      const user: User = {
        id: userId,
        type: "authenticated",
        name: userId,
      };

      const newClient = new StreamVideoClient({
        apiKey: streamApiKey,
        user,
        token: userToken,
        options: { timeout: 50000 },
      });

      const callId = window.location.pathname.split("/")[2];

      await newClient.connectUser(user, userToken);
      setClient(newClient);

      if (role === "host") {
        const newCall = newClient.call("interview", callId);
        await newCall.getOrCreate({
          data: meeting,
          ring: true,
        });

        // Start ringing for all members
        await newCall.ring();

        setCall(newCall);
        setHasJoined(true);
      } else {
        console.log("Waiting for the host to join");
        setWaitForRing(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to setup the call");
      throw err;
    }
  };

  if (waitForRing)
    return (
      <StreamVideo client={client!}>
        <StreamCall>
          <Waiting />
        </StreamCall>
      </StreamVideo>
    );

  if (!hasJoined || !call) {
    return <Lobby setup={setupCall} />;
  }

  return (
    <StreamVideo client={client!}>
      <StreamTheme>
        <StreamCall call={call}>
          <Meet call={call} client={client} />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
};

export default Main;
