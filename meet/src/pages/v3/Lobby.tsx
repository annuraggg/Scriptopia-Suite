import { WorldMap } from "@/components/ui/world-map";
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

  const streamApiKey = import.meta.env.VITE_STREAM_API_SECRET;

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
      // Store necessary information in localStorage
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
    <div className="flex items-center justify-center h-screen">
      <div className="absolute h-screen w-screen">
        <WorldMap
    
        />
      </div>
      <div className="w-64 flex flex-col items-center justify-center gap-5">
        <div className="text-sm text-center">
          <p>
            Stream Token: <span className="text-blue-300">{streamApiKey}</span>
          </p>
          <p>
            Your ID is: <span className="text-red-300">{id}</span>
          </p>
          <p>
            Generate Token for your id at:{" "}
            <a
              className="underline"
              href="https://getstream.io/chat/docs/react/token_generator/"
              target="_blank"
            >
              this page
            </a>
          </p>
        </div>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Enter your token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <div className="flex items-center gap-5">
          <p>Join As: </p>
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
          color="success"
          variant="flat"
          className="w-full"
          isLoading={isJoining}
          onClick={createOrJoinRoom}
        >
          {isJoining ? "Joining..." : "Join"}
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
