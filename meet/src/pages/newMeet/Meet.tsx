import {
    CallControls,
    SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const apiKey = "mmhfdzb5evj2"
const userId = "Nom_Anor";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL05vbV9Bbm9yIiwidXNlcl9pZCI6Ik5vbV9Bbm9yIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3Mzc5ODMzMzQsImV4cCI6MTczODU4ODEzNH0.tMwc_oDA0qg0DySUCNO1JIAvV9sjq7eFhj9wWqi5MMI";
const user: User = { id: userId };

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", "yCjAKjiCAWEM");
call.join({ create: true });

const MyApp = () => {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme>
          <SpeakerLayout />
          <CallControls />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export const MyVideoButton = () => {
  const { useCameraState } = useCallStateHooks();
  const { camera, isMute } = useCameraState();
  return (
    <button onClick={() => camera.toggle()}>
      {isMute ? "Turn on camera" : "Turn off camera"}
    </button>
  );
};

export const MyMicrophoneButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  return (
    <button onClick={() => microphone.toggle()}>
      {isMute ? "Turn on microphone" : "Turn off microphone"}
    </button>
  );
};

export default MyApp;
