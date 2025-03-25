import React, { useCallback, useEffect, useState } from "react";
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
  User,
  Users,
} from "lucide-react";
import {
  Call,
  OwnCapability,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { toast } from "sonner";

interface ActionButtonsProps {
  call: Call;
  onChatToggle: (isOpen: boolean) => void;
  participantsOpen: boolean;
  setParticipantsOpen: (isOpen: boolean) => void;
  role: string;
}

const ActionButtons = ({
  call,
  onChatToggle,
  participantsOpen,
  setParticipantsOpen,
  role,
}: ActionButtonsProps) => {
  const {
    useCameraState,
    useMicrophoneState,
    useScreenShareState,
    useIsCallRecordingInProgress,
  } = useCallStateHooks();
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
  const { isMute: isScreenShareOff, screenShare } = useScreenShareState();

  const [isCallRecordingLoading, setIsCallRecordingLoading] = useState(false);
  const [callRecordPermission, setCallRecordPermission] = useState(false);

  const isCallRecordingInProgress = useIsCallRecordingInProgress();

  const [chat, setChat] = React.useState(false);

  const handleShareScreen = async () => {
    const canScreenShare = call.permissionsContext.hasPermission(
      OwnCapability.SCREENSHARE
    );

    if (!isScreenShareOff) {
      await screenShare.toggle();
      return;
    }

    if (canScreenShare) {
      await screenShare.toggle();
      return;
    }

    if (!call.permissionsContext.canRequest(OwnCapability.SCREENSHARE)) {
      toast.error(
        "The host has disabled the ability to request this permission"
      );
      return;
    }

    toast("You do not have the permission to share your screen.", {
      action: {
        label: "Request",
        onClick: () =>
          call.requestPermissions({
            permissions: [OwnCapability.SCREENSHARE],
          }),
      },
    });
  };

  useEffect(() => {
    const canRecord = call.permissionsContext.hasPermission(
      OwnCapability.START_RECORD_CALL
    );

    setCallRecordPermission(canRecord);
  }, []);

  const handleMicrophoneChange = async (deviceId: string) => {
    await microphone.select(deviceId);
  };

  const handleCameraChange = async (deviceId: string) => {
    await camera.select(deviceId);
  };

  const toggleRecording = useCallback(async () => {
    try {
      setIsCallRecordingLoading(true);
      if (isCallRecordingInProgress) {
        await call?.stopRecording();
        toast.info("Recording stopped");
      } else {
        await call?.startRecording();
        toast.info("This call is now being recorded");
      }
    } catch (e) {
      console.error(`Failed start recording`, e);
    }
  }, [call, isCallRecordingInProgress]);

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

      {/* Present Screen */}
      <Button
        radius="full"
        variant="flat"
        size="lg"
        isIconOnly
        className={
          !isScreenShareOff ? "text-blue-500 bg-blue-900 bg-opacity-50" : ""
        }
        onClick={handleShareScreen}
      >
        <MonitorUp />
      </Button>

      {/* Recording */}
      {callRecordPermission && (
        <Button
          radius="full"
          variant="flat"
          size="lg"
          isIconOnly
          color={isCallRecordingInProgress ? "danger" : "default"}
          isLoading={isCallRecordingLoading}
          onClick={async () => toggleRecording()}
        >
          <Disc2 />
        </Button>
      )}

      {/* Waiting Room */}

      {role === "interviewer" && (
        <Button
          radius="full"
          variant="flat"
          size="lg"
          isIconOnly
          className={
            participantsOpen ? "text-blue-500 bg-blue-800 bg-opacity-50" : ""
          }
          onClick={() => setParticipantsOpen(!participantsOpen)}
        >
          <Users />
        </Button>
      )}
      
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

      {role === "interviewer" && (
        <Button radius="full" variant="light" size="lg" isIconOnly>
          <User />
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
