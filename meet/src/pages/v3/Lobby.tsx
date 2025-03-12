import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Mic,
  CameraOff,
  MicOff,
  Video,
  AlertCircle,
  LogIn,
} from "lucide-react";
import Squares from "@/components/ui/Squares";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Switch,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";

interface DeviceState {
  enabled: boolean;
  permission: "granted" | "denied" | "prompt" | "unknown";
  working: boolean;
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
}

interface LobbyProps {
  onJoin: () => void;
}

const Lobby = ({ onJoin }: LobbyProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audioDataArray, setAudioDataArray] = useState<number[]>(
    Array(20).fill(0)
  );
  const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [camera, setCamera] = useState<DeviceState>({
    enabled: false,
    permission: "unknown",
    working: false,
    devices: [],
    selectedDevice: null,
  });

  const [microphone, setMicrophone] = useState<DeviceState>({
    enabled: false,
    permission: "unknown",
    working: false,
    devices: [],
    selectedDevice: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  // Check permissions on component mount
  useEffect(() => {
    checkPermissions();
    enumerateDevices();
  }, []);

  // Audio level monitoring
  useEffect(() => {
    let animationFrame: number;

    const updateAudioLevel = () => {
      if (audioAnalyser) {
        const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
        audioAnalyser.getByteFrequencyData(dataArray);

        // Use a smaller sample size for faster updates
        const sampleSize = Math.max(1, Math.floor(dataArray.length / 20));
        const newAudioDataArray = Array(20).fill(0);

        for (let i = 0; i < 20; i++) {
          let sum = 0;
          for (let j = 0; j < sampleSize; j++) {
            const index = i * sampleSize + j;
            if (index < dataArray.length) {
              sum += dataArray[index];
            }
          }
          // Apply less smoothing for more immediate response
          const prevValue = audioDataArray[i] || 0;
          const newValue = sum / sampleSize / 256;
          newAudioDataArray[i] = prevValue * 0.3 + newValue * 0.7; // Less smoothing
        }

        setAudioDataArray(newAudioDataArray);

        // Calculate overall audio level with less smoothing
      }
      animationFrame = requestAnimationFrame(updateAudioLevel);
    };

    if (audioAnalyser) {
      updateAudioLevel();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [audioAnalyser]);

  // Check permissions for camera and microphone
  const checkPermissions = async () => {
    // Check camera permission
    try {
      const cameraPermission = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setCamera((prev) => ({
        ...prev,
        permission: cameraPermission.state as any,
      }));

      // Set up listener for permission changes
      cameraPermission.onchange = () => {
        setCamera((prev) => ({
          ...prev,
          permission: cameraPermission.state as any,
        }));
      };
    } catch (error) {
      console.error("Error checking camera permissions:", error);
    }

    // Check microphone permission
    try {
      const microphonePermission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setMicrophone((prev) => ({
        ...prev,
        permission: microphonePermission.state as any,
      }));

      // Set up listener for permission changes
      microphonePermission.onchange = () => {
        setMicrophone((prev) => ({
          ...prev,
          permission: microphonePermission.state as any,
        }));
      };
    } catch (error) {
      console.error("Error checking microphone permissions:", error);
    }
  };

  // Get list of available devices
  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );

      setCamera((prev) => ({
        ...prev,
        devices: videoDevices,
        selectedDevice:
          videoDevices.length > 0 ? videoDevices[0].deviceId : null,
      }));

      setMicrophone((prev) => ({
        ...prev,
        devices: audioDevices,
        selectedDevice:
          audioDevices.length > 0 ? audioDevices[0].deviceId : null,
      }));
    } catch (error) {
      console.error("Error enumerating devices:", error);
    }
  };

  // Toggle camera
  const toggleCamera = async () => {
    if (camera.enabled) {
      // Turn off camera
      if (mediaStream) {
        mediaStream.getVideoTracks().forEach((track) => track.stop());
        const audioTracks = mediaStream.getAudioTracks();

        if (audioTracks.length > 0 && microphone.enabled) {
          // Create new stream with only audio
          const newStream = new MediaStream(audioTracks);
          setMediaStream(newStream);
        } else {
          setMediaStream(null);
        }
      }

      setCamera((prev) => ({ ...prev, enabled: false, working: false }));
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } else {
      // Turn on camera
      try {
        let stream: MediaStream;

        if (mediaStream && microphone.enabled) {
          // Add video track to existing stream
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: camera.selectedDevice
              ? { deviceId: { exact: camera.selectedDevice } }
              : true,
          });

          const videoTrack = videoStream.getVideoTracks()[0];
          stream = mediaStream;
          stream.addTrack(videoTrack);
        } else {
          // Create new stream
          stream = await navigator.mediaDevices.getUserMedia({
            video: camera.selectedDevice
              ? { deviceId: { exact: camera.selectedDevice } }
              : true,
            audio: false,
          });
        }

        setMediaStream(stream);
        setCamera((prev) => ({
          ...prev,
          enabled: true,
          working: true,
          permission: "granted",
        }));

        // Update video preview
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .catch((e) => console.error("Error playing video:", e));
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCamera((prev) => ({ ...prev, permission: "denied" }));
      }
    }
  };

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (microphone.enabled) {
      // Turn off microphone
      if (mediaStream) {
        mediaStream.getAudioTracks().forEach((track) => track.stop());
        const videoTracks = mediaStream.getVideoTracks();

        if (videoTracks.length > 0 && camera.enabled) {
          // Create new stream with only video
          const newStream = new MediaStream(videoTracks);
          setMediaStream(newStream);
        } else {
          setMediaStream(null);
        }
      }

      setMicrophone((prev) => ({ ...prev, enabled: false, working: false }));
      setAudioAnalyser(null);
      setAudioDataArray(Array(20).fill(0));
    } else {
      // Turn on microphone
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        let stream: MediaStream;

        if (mediaStream && camera.enabled) {
          // Add audio track to existing stream
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: microphone.selectedDevice
              ? { deviceId: { exact: microphone.selectedDevice } }
              : true,
          });

          const audioTrack = audioStream.getAudioTracks()[0];
          stream = mediaStream;
          stream.addTrack(audioTrack);
        } else {
          // Create new stream
          stream = await navigator.mediaDevices.getUserMedia({
            audio: microphone.selectedDevice
              ? { deviceId: { exact: microphone.selectedDevice } }
              : true,
            video: false,
          });
        }

        setMediaStream(stream);
        setMicrophone((prev) => ({
          ...prev,
          enabled: true,
          working: true,
          permission: "granted",
        }));

        // Set up audio analyzer
        const audioContext = audioContextRef.current;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 128; // Smaller FFT size for faster processing
        analyser.smoothingTimeConstant = 0.2;
        source.connect(analyser);
        setAudioAnalyser(analyser);

        // Update video preview (in case both are enabled)
        if (videoRef.current && camera.enabled) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setMicrophone((prev) => ({ ...prev, permission: "denied" }));
      }
    }
  };

  // Handle camera device change
  const handleCameraChange = async (deviceId: string) => {
    setCamera((prev) => ({ ...prev, selectedDevice: deviceId }));

    if (camera.enabled) {
      // Update active camera
      try {
        const wasEnabled = camera.enabled;

        // Stop current video track
        if (mediaStream) {
          mediaStream.getVideoTracks().forEach((track) => track.stop());
        }

        if (wasEnabled) {
          // Get new video track
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } },
          });

          const videoTrack = videoStream.getVideoTracks()[0];

          // Create new stream with existing audio (if any) and new video
          const newStream = new MediaStream();

          // Add existing audio tracks if microphone is enabled
          if (mediaStream && microphone.enabled) {
            mediaStream
              .getAudioTracks()
              .forEach((track) => newStream.addTrack(track));
          }

          // Add new video track
          newStream.addTrack(videoTrack);
          setMediaStream(newStream);

          // Update video preview
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
        }
      } catch (error) {
        console.error("Error changing camera device:", error);
        setCamera((prev) => ({ ...prev, working: false }));
      }
    }
  };

  // Handle microphone device change
  const handleMicrophoneChange = async (deviceId: string) => {
    setMicrophone((prev) => ({ ...prev, selectedDevice: deviceId }));

    if (microphone.enabled) {
      // Update active microphone
      try {
        const wasEnabled = microphone.enabled;

        // Stop current audio track
        if (mediaStream) {
          mediaStream.getAudioTracks().forEach((track) => track.stop());
        }

        if (wasEnabled) {
          // Get new audio track
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: deviceId } },
          });

          const audioTrack = audioStream.getAudioTracks()[0];

          // Create new stream with existing video (if any) and new audio
          const newStream = new MediaStream();

          // Add existing video tracks if camera is enabled
          if (mediaStream && camera.enabled) {
            mediaStream
              .getVideoTracks()
              .forEach((track) => newStream.addTrack(track));
          }

          // Add new audio track
          newStream.addTrack(audioTrack);
          setMediaStream(newStream);

          // Update video preview (if camera is enabled)
          if (videoRef.current && camera.enabled) {
            videoRef.current.srcObject = newStream;
          }

          // Set up audio analyzer
          const audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(newStream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          setAudioAnalyser(analyser);
        }
      } catch (error) {
        console.error("Error changing microphone device:", error);
        setMicrophone((prev) => ({ ...prev, working: false }));
      }
    }
  };

  // Join the call
  const joinCall = () => {
    onJoin();
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [mediaStream]);

  useEffect(() => {
    if (videoRef.current && camera.enabled && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current
        .play()
        .catch((e) => console.error("Error playing video:", e));
    }
  }, [videoRef.current, camera.enabled, mediaStream]);

  // Render audio visualization
  const renderAudioWaves = () => {
    return (
      <div className="flex items-end justify-center h-16 space-x-1">
        {audioDataArray.map((level, index) => {
          const height = Math.max(4, Math.floor(level * 64));
          return (
            <div
              key={index}
              className="bg-primary rounded-full w-1 transition-all duration-100 ease-out"
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="black"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="flex justify-center pb-0">
            <h2 className="text-3xl font-bold mb-3">Join Video Call</h2>
          </CardHeader>

          <CardBody>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Camera Section */}
              <div className="flex-1">
                <Card className="bg-zinc-800 mb-4">
                  <CardBody className="p-0 overflow-hidden">
                    <div className="aspect-video relative">
                      {camera.enabled ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-zinc-900">
                          <Video className="h-16 w-16 text-zinc-700" />
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-zinc-800">
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 w-full">
                        <Tooltip
                          content={
                            camera.enabled ? "Camera is on" : "Camera is off"
                          }
                        >
                          <div>
                            {" "}
                            {camera.enabled ? (
                              <Camera className="text-primary" size={20} />
                            ) : (
                              <CameraOff
                                className="text-default-400"
                                size={20}
                              />
                            )}
                          </div>
                        </Tooltip>
                        <span className="text-sm font-medium text-default-500">
                          Camera
                        </span>
                      </div>
                      <Switch
                        isSelected={camera.enabled}
                        onValueChange={toggleCamera}
                        size="sm"
                        color="success"
                        aria-label={
                          camera.enabled ? "Turn off camera" : "Turn on camera"
                        }
                      />
                    </div>

                    <div className="mt-3">
                      <Select
                        label="Select Camera"
                        selectedKeys={
                          camera.selectedDevice ? [camera.selectedDevice] : []
                        }
                        onChange={(e) => handleCameraChange(e.target.value)}
                        isDisabled={!camera.devices.length}
                        size="sm"
                        className="w-full"
                      >
                        {camera.devices.length ? (
                          camera.devices.map((device) => (
                            <SelectItem
                              key={device.deviceId}
                              value={device.deviceId}
                            >
                              {device.label ||
                                `Camera ${camera.devices.indexOf(device) + 1}`}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="no-camera" value="">
                            No cameras found
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Microphone Section */}
              <div className="flex-1">
                <Card className="bg-zinc-900 mb-4">
                  <CardBody className="p-0 overflow-hidden">
                    <div className="aspect-video relative flex flex-col items-center justify-center">
                      <div className="mb-4 mt-4">
                        {microphone.enabled ? (
                          <Mic className="h-12 w-12 text-primary" />
                        ) : (
                          <MicOff className="h-12 w-12 text-zinc-700" />
                        )}
                      </div>

                      {microphone.enabled ? (
                        <div className="w-full px-6 pb-6">
                          {renderAudioWaves()}
                        </div>
                      ) : (
                        <p className="text-default-500 text-center pb-6">
                          Microphone is off
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-zinc-800">
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Tooltip
                          content={
                            microphone.enabled
                              ? "Microphone is on"
                              : "Microphone is off"
                          }
                        >
                          {microphone.enabled ? (
                            <Mic className="text-primary" size={20} />
                          ) : (
                            <MicOff className="text-default-400" size={20} />
                          )}
                        </Tooltip>
                        <span className="text-sm font-medium text-default-500">
                          Microphone
                        </span>
                      </div>
                      <Switch
                        isSelected={microphone.enabled}
                        onValueChange={toggleMicrophone}
                        color="success"
                        size="sm"
                        aria-label={
                          microphone.enabled
                            ? "Turn off microphone"
                            : "Turn on microphone"
                        }
                      />
                    </div>

                    <div className="mt-3">
                      <Select
                        label="Select Microphone"
                        selectedKeys={
                          microphone.selectedDevice
                            ? [microphone.selectedDevice]
                            : []
                        }
                        onChange={(e) => handleMicrophoneChange(e.target.value)}
                        isDisabled={!microphone.devices.length}
                        size="sm"
                        className="w-full"
                      >
                        {microphone.devices.length ? (
                          microphone.devices.map((device) => (
                            <SelectItem
                              key={device.deviceId}
                              value={device.deviceId}
                            >
                              {device.label ||
                                `Microphone ${
                                  microphone.devices.indexOf(device) + 1
                                }`}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="no-mic" value="">
                            No microphones found
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>

            {/* Join Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={joinCall}
                size="lg"
                startContent={<LogIn size={20} />}
              >
                Join Call
              </Button>
            </div>

            {/* Permissions Warning */}
            {(camera.permission === "denied" ||
              microphone.permission === "denied") && (
              <Card className="mt-6 bg-warning-50">
                <CardBody className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-warning-700">
                    <p>
                      {camera.permission === "denied" &&
                      microphone.permission === "denied"
                        ? "Camera and microphone permissions are denied. Please allow access in your browser settings."
                        : camera.permission === "denied"
                        ? "Camera permission is denied. Please allow access in your browser settings."
                        : "Microphone permission is denied. Please allow access in your browser settings."}
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Lobby;
