import { Button } from "@nextui-org/react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import {
  Camera,
  CameraOff,
  Disc2,
  MessageSquare,
  MessageSquareOff,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Settings,
  Users,
} from "lucide-react";

interface ActionButtonsProps {
  mic: boolean;
  camera: boolean;
  chat: boolean;
  present: boolean;
  recording: boolean;
  setSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setMic: React.Dispatch<React.SetStateAction<boolean>>;
  setCamera: React.Dispatch<React.SetStateAction<boolean>>;
  setChat: React.Dispatch<React.SetStateAction<boolean>>;
  setPresent: React.Dispatch<React.SetStateAction<boolean>>;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  waitingRoom: boolean;
  setWaitingRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons = ({
  mic,
  camera,
  chat,
  present,
  recording,
  setSettings,
  setMic,
  setCamera,
  setChat,
  setPresent,
  setRecording,
  waitingRoom,
  setWaitingRoom,
}: ActionButtonsProps) => {
  const { useCameraState } = useCallStateHooks();
  const { camera: cameraState } = useCameraState();

  return (
    <div className="flex items-center justify-center pt-5 gap-2 w-full relative">
      <Button
        radius="full"
        variant="flat"
        size="lg"
        isIconOnly
        color={mic ? "success" : "danger"}
        onClick={() => setMic((prev) => !prev)}
      >
        {mic ? <Mic /> : <MicOff />}
      </Button>

      <Button
        radius="full"
        variant="flat"
        size="lg"
        isIconOnly
        color={camera ? "success" : "danger"}
        onClick={async () => {
          if (camera) {
            setCamera(false);
            await cameraState.disable();
          } else {
            setCamera(true);
            await cameraState.enable();
          }
        }}
      >
        {camera ? <Camera /> : <CameraOff />}
      </Button>

      <Button
        radius="full"
        variant="flat"
        size="lg"
        isIconOnly
        onClick={() => setChat((prev) => !prev)}
      >
        {chat ? <MessageSquare /> : <MessageSquareOff />}
      </Button>

      <Button
        radius="full"
        variant="flat"
        size="lg"
        isIconOnly
        className={present ? "text-blue-500 bg-blue-900 bg-opacity-50" : ""}
        onClick={() => setPresent((prev) => !prev)}
      >
        <MonitorUp />
      </Button>

      <Button
        radius="full"
        variant="flat"
        size="lg"
        isIconOnly
        color={recording ? "danger" : "default"}
        onClick={() => setRecording((prev) => !prev)}
      >
        <Disc2 />
      </Button>

      <Button
        radius="full"
        variant="flat"
        size="lg"
        isIconOnly
        className={waitingRoom ? "text-blue-500 bg-blue-800 bg-opacity-50" : ""}
        onClick={() => setWaitingRoom((prev) => !prev)}
      >
        <Users />
      </Button>

      <Button size="md" className="bg-red-700 ml-5" radius="full" onClick={() => call}>
        <PhoneOff />
      </Button>
{/* 
      <Button
        radius="full"
        variant="light"
        size="lg"
        isIconOnly
        className="absolute right-5"
        onClick={() => setSettings((prev) => !prev)}
      >
        <Settings />
      </Button> */}
    </div>
  );
};

export default ActionButtons;
