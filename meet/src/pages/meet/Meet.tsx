import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const Meet = () => {
  const username = window.location.pathname.split("/")[2];
  // token in get params
  const token = new URLSearchParams(window.location.search).get("token")!;
  const user: User = {
    id: username,
  };

  const client = new StreamVideoClient({ apiKey, token, user });
  const call = client.call("default", "first");
  call.join({ create: true });

  return (
    <div>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            <SpeakerLayout />
            <CallControls />
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default Meet;
