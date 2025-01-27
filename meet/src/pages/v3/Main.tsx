import {
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import Lobby from "./Lobby";
import Meet from "./call/Meet";

const Main = () => {
  const streamApiKey = import.meta.env.VITE_STREAM_API_KEY;
  const [call, setCall] = useState<any>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  const setupCall = async (userId: string, userToken: string) => {
    const user: User = { id: userId, type: "authenticated" };
    const newClient = new StreamVideoClient({
      apiKey: streamApiKey,
      user,
      token: userToken,
      options: { timeout: 50000 },
    });

    const callId = window.location.pathname.split("/")[2];
    const newCall = newClient.call("default", callId);

    newCall.join({ create: true });

    setClient(newClient);
    setCall(newCall);
    setHasJoined(true);
  };

  if (!hasJoined) {
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
