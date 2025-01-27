import React from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
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
import { Call, useCallStateHooks } from "@stream-io/video-react-sdk";

interface ActionButtonsProps {
  call: Call;
  onChatToggle: (isOpen: boolean) => void;
  onSettingsToggle: (isOpen: boolean) => void;
}

const ActionButtons = ({
  call,
  onChatToggle,
  onSettingsToggle,
}: ActionButtonsProps) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const {
    camera,
    devices: camDevices,
    isMute: isCamOff,
    selectedDevice: selectedCam,
  } = useCameraState();
  const {
    microphone,
    devices: micDevices,
    isMute: isMicOff,
    selectedDevice: selectedMic,
  } = useMicrophoneState();

  const [present, setPresent] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [waitingRoom, setWaitingRoom] = React.useState(false);
  const [chat, setChat] = React.useState(false);

  const handleMicrophoneChange = async (deviceId: string) => {
    await microphone.select(deviceId);
  };

  const handleCameraChange = async (deviceId: string) => {
    await camera.select(deviceId);
  };

  const handleChatToggle = () => {
    const newValue = !chat;
    setChat(newValue);
    onChatToggle(newValue);
  };

  const handleEndCall = () => {
    call.leave();
  };

  return (
    <div className="flex items-center justify-center pt-5 gap-2 w-full relative">
      {/* Microphone Controls */}
      <div className="flex items-center">
        <Button
          radius="full"
          className="rounded-r-none"
          variant="flat"
          size="lg"
          isIconOnly
          color={!isMicOff ? "success" : "danger"}
          onClick={() => microphone.toggle()}
        >
          {isMicOff ? <MicOff /> : <Mic />}
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize rounded-l-none max-w-10 p-0 pr-5"
              variant="flat"
              color={isMicOff ? "danger" : "success"}
              size="lg"
            >
              <div className="truncate text-ellipsis whitespace-nowrap overflow-hidden">
                {selectedMic || "Select Microphone"}
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Select Microphone"
            selectedKeys={new Set([selectedMic!])}
            selectionMode="single"
            onSelectionChange={(keys) =>
              handleMicrophoneChange(Array.from(keys)[0] as string)
            }
          >
            {micDevices?.map((device) => (
              <DropdownItem key={device.deviceId}>{device.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Camera Controls */}
      <div className="flex items-center">
        <Button
          radius="full"
          variant="flat"
          className="rounded-r-none"
          size="lg"
          isIconOnly
          color={!isCamOff ? "success" : "danger"}
          onClick={() => camera.toggle()}
        >
          {isCamOff ? <CameraOff /> : <Camera />}
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize rounded-full border-l rounded-l-none max-w-10 p-0 pr-5"
              variant="flat"
              color={isCamOff ? "danger" : "success"}
              size="lg"
            >
              <div className="truncate text-ellipsis whitespace-nowrap overflow-hidden">
                {camDevices?.find((cam) => cam.deviceId === selectedCam)
                  ?.label || "Select Camera"}
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Select Camera"
            selectedKeys={new Set([selectedCam!])}
            selectionMode="single"
            onSelectionChange={(keys) =>
              handleCameraChange(Array.from(keys)[0] as string)
            }
          >
            {camDevices?.map((device) => (
              <DropdownItem key={device.deviceId}>{device.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Chat Toggle */}
      <Button
        radius="full"
        variant="flat"
        size="lg"
        isIconOnly
        onClick={handleChatToggle}
      >
        {chat ? <MessageSquare /> : <MessageSquareOff />}
      </Button>

      {/* Present Screen */}
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

      {/* Recording */}
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

      {/* Waiting Room */}
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

      {/* End Call */}
      <Button
        size="lg"
        color="danger"
        className="ml-5"
        radius="full"
        onClick={handleEndCall}
      >
        <PhoneOff />
      </Button>

      {/* Settings */}
      <Button
        radius="full"
        variant="light"
        size="lg"
        isIconOnly
        className="absolute right-5"
        onClick={() => onSettingsToggle(true)}
      >
        <Settings />
      </Button>
    </div>
  );
};

export default ActionButtons;
