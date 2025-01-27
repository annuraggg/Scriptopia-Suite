import Squares from "@/components/ui/Squares";
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface LobbyProps {
  setup: (userId: string, userToken: string) => void;
}

const Lobby = ({ setup }: LobbyProps) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"host" | "guest">("host");
  const [token, setToken] = useState("");
  const [id, setId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const streamApiKey = import.meta.env.VITE_STREAM_API_SECRET as string;

  useEffect(() => {
    const id = Math.random().toString(36).substr(2, 9);
    setId(id);
  }, []);

  const createOrJoinRoom = async () => {
    if (!token || !name) {
      alert("Please enter your name and token");
      return;
    }

    setIsJoining(true);
    try {
      localStorage.setItem("streamUserId", id);
      localStorage.setItem("streamUserToken", token);
      localStorage.setItem("streamUserName", name);
      setup(id, token);
    } catch (error) {
      console.error("Error joining room:", error);
      setIsJoining(false);
      alert("Failed to join room. Please try again.");
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="black"
          hoverFillColor="#222"
        />
      </div>

      <div className="relative z-10 w-full px-6 flex items-center justify-center flex-col max-w-md">
        <div className="backdrop-blur-sm bg-background/50 rounded-3xl shadow-2xl border border-divider w-full">
          {/* Header Section */}
          <div className="p-8 pb-6 border-b border-divider">
            <h2 className="text-2xl text-center mb-4">Scriptopia Meets</h2>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-default-500">Your ID:</span>
              <code className="px-2 py-1 rounded-xl bg-default-100">{id}</code>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <Input
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
              />

              <Input
                label="Token"
                placeholder="Enter your token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                isRequired
              />
            </div>

            <div className="flex gap-5">
              <p>Join as</p>
              <RadioGroup
                orientation="horizontal"
                value={role}
                onChange={(e) => setRole(e.target.value as "host" | "guest")}
              >
                <Radio value="host">Host</Radio>
                <Radio value="guest">Guest</Radio>
              </RadioGroup>
            </div>

            <Button
              size="lg"
              className="w-full"
              color="success"
              variant="flat"
              isLoading={isJoining}
              onClick={createOrJoinRoom}
            >
              {isJoining ? "Joining..." : "Join Room"}
            </Button>

            <div className="text-center text-sm text-default-500">
              <span>Need a token? </span>
              <a
                href="https://getstream.io/chat/docs/react/token_generator/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Generate one here
              </a>
            </div>
          </div>
        </div>{" "}
        <div className="text-center mt-5 bg-background/100  min-w-fit p-2 rounded-2xl px-5">
          <p className="flex gap-2 justify-center items-center">
            Secret:
            <span className="text-blue-300 text-wrap">{streamApiKey}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
