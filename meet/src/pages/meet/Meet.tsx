import { useEffect, useState } from "react";
import ActionButtons from "./ActionButtons";
import Chatbox from "./Chatbox/Chatbox";
import Settings from "./Settings";
import Waiting from "./Waiting/Waiting";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User as UserType,
} from "@stream-io/video-react-sdk";
import User from "./User";

interface participantsProps {
  name: string;
  email: string;
  photo: string;
  _id: string;
  joinedAt: Date;
  scheduledAt: Date;
}

const waitingRoomParticipantsSample = [
  {
    name: "John DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn Doe",
    email: "john.doe@example.com",
    photo: "https://picsum.photos/id/237/200/300",
    _id: "1",
    joinedAt: new Date("2023-01-15"),
    scheduledAt: new Date("2023-01-20"),
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    photo: "https://picsum.photos/id/238/200/300",
    _id: "2",
    joinedAt: new Date("2023-02-10"),
    scheduledAt: new Date("2023-02-15"),
  },
  {
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    photo: "https://picsum.photos/id/239/200/300",
    _id: "3",
    joinedAt: new Date("2023-03-05"),
    scheduledAt: new Date("2023-03-10"),
  },
  {
    name: "Emily Brown",
    email: "emily.brown@example.com",
    photo: "https://picsum.photos/id/240/200/300",
    _id: "4",
    joinedAt: new Date("2023-04-01"),
    scheduledAt: new Date("2023-04-05"),
  },
  {
    name: "William Davis",
    email: "william.davis@example.com",
    photo: "https://picsum.photos/id/241/200/300",
    _id: "5",
    joinedAt: new Date("2023-05-20"),
    scheduledAt: new Date("2023-05-25"),
  },
  {
    name: "Olivia Wilson",
    email: "olivia.wilson@example.com",
    photo: "https://picsum.photos/id/242/200/300",
    _id: "6",
    joinedAt: new Date("2023-06-15"),
    scheduledAt: new Date("2023-06-20"),
  },
  {
    name: "James Martinez",
    email: "james.martinez@example.com",
    photo: "https://picsum.photos/id/243/200/300",
    _id: "7",
    joinedAt: new Date("2023-07-10"),
    scheduledAt: new Date("2023-07-15"),
  },
  {
    name: "Sophia Anderson",
    email: "sophia.anderson@example.com",
    photo: "https://picsum.photos/id/244/200/300",
    _id: "8",
    joinedAt: new Date("2023-08-05"),
    scheduledAt: new Date("2023-08-10"),
  },
  {
    name: "Daniel Taylor",
    email: "daniel.taylor@example.com",
    photo: "https://picsum.photos/id/245/200/300",
    _id: "9",
    joinedAt: new Date("2023-09-01"),
    scheduledAt: new Date("2023-09-05"),
  },
  {
    name: "Isabella Thomas",
    email: "isabella.thomas@example.com",
    photo: "https://picsum.photos/id/246/200/300",
    _id: "10",
    joinedAt: new Date("2023-10-20"),
    scheduledAt: new Date("2023-10-25"),
  },
  {
    name: "Alexander Garcia",
    email: "alexander.garcia@example.com",
    photo: "https://picsum.photos/id/247/200/300",
    _id: "11",
    joinedAt: new Date("2023-11-15"),
    scheduledAt: new Date("2023-11-20"),
  },
  {
    name: "Mia Hernandez",
    email: "mia.hernandez@example.com",
    photo: "https://picsum.photos/id/248/200/300",
    _id: "12",
    joinedAt: new Date("2023-12-10"),
    scheduledAt: new Date("2023-12-15"),
  },
  {
    name: "Matthew Martinez",
    email: "matthew.martinez@example.com",
    photo: "https://picsum.photos/id/249/200/300",
    _id: "13",
    joinedAt: new Date("2024-01-05"),
    scheduledAt: new Date("2024-01-10"),
  },
  {
    name: "Ava Robinson",
    email: "ava.robinson@example.com",
    photo: "https://picsum.photos/id/250/200/300",
    _id: "14",
    joinedAt: new Date("2024-02-01"),
    scheduledAt: new Date("2024-02-05"),
  },
  {
    name: "Elijah Clark",
    email: "elijah.clark@example.com",
    photo: "https://picsum.photos/id/251/200/300",
    _id: "15",
    joinedAt: new Date("2024-03-20"),
    scheduledAt: new Date("2024-03-25"),
  },
  {
    name: "Charlotte Lewis",
    email: "charlotte.lewis@example.com",
    photo: "https://picsum.photos/id/252/200/300",
    _id: "16",
    joinedAt: new Date("2024-04-15"),
    scheduledAt: new Date("2024-04-20"),
  },
  {
    name: "Benjamin Walker",
    email: "benjamin.walker@example.com",
    photo: "https://picsum.photos/id/253/200/300",
    _id: "17",
    joinedAt: new Date("2024-05-10"),
    scheduledAt: new Date("2024-05-15"),
  },
  {
    name: "Amelia Young",
    email: "amelia.young@example.com",
    photo: "https://picsum.photos/id/254/200/300",
    _id: "18",
    joinedAt: new Date("2024-06-05"),
    scheduledAt: new Date("2024-06-10"),
  },
  {
    name: "Lucas King",
    email: "lucas.king@example.com",
    photo: "https://picsum.photos/id/255/200/300",
    _id: "19",
    joinedAt: new Date("2024-07-01"),
    scheduledAt: new Date("2024-07-05"),
  },
  {
    name: "Grace Green",
    email: "grace.green@example.com",
    photo: "https://picsum.photos/id/256/200/300",
    _id: "20",
    joinedAt: new Date("2024-08-20"),
    scheduledAt: new Date("2024-08-25"),
  },
];

const finishedParticipantsSample = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    photo: "https://picsum.photos/id/237/200/300",
    _id: "1",
    joinedAt: new Date("2023-01-15"),
    scheduledAt: new Date("2023-01-20"),
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    photo: "https://picsum.photos/id/238/200/300",
    _id: "2",
    joinedAt: new Date("2023-02-10"),
    scheduledAt: new Date("2023-02-15"),
  },
];

const currentParticipantSample = {
  name: "Michael Johnson",
  email: "michael.johnson@example.com",
  photo: "https://picsum.photos/id/239/200/300",
  _id: "3",
  joinedAt: new Date("2023-03-05"),
  scheduledAt: new Date("2023-03-10"),
};

const Meet = () => {
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [chat, setChat] = useState(false);
  const [present, setPresent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [settings, setSettings] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);

  const [waitingRoomParticipants, setWaitingRoomParticipants] = useState<
    participantsProps[]
  >([]);
  const [finishedParticipants, setFinishedParticipants] = useState<
    participantsProps[]
  >([]);
  const [currentParticipant, setCurrentParticipant] =
    useState<participantsProps>({} as participantsProps);

  useEffect(() => {
    setWaitingRoomParticipants(waitingRoomParticipantsSample);
    setCurrentParticipant(currentParticipantSample);
    setFinishedParticipants(finishedParticipantsSample);
  }, []);

  const apiKey = import.meta.env.VITE_STREAM_API_KEY as string;
  const userId = window.location.pathname.split("/").pop() || "";
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const user: UserType = { id: userId };
  const room = window.location.pathname.split("/")[1];

  const client = new StreamVideoClient({ apiKey, user, token });
  const call = client.call("interview", room);
  call.join({ create: true });

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="w-[100vw]  h-screen flex flex-col items-center justify-center px-5 py-5 overflow-x-hidden relative">
          <div className="flex gap-5 w-[100vw] h-full overflow-x-hidden relative">
            <User isOpen={chat || settings || waitingRoom} />
            <Chatbox isOpen={chat} />
            <Settings isOpen={settings} />
            <Waiting
              isOpen={waitingRoom}
              current={currentParticipant}
              waiting={waitingRoomParticipants}
              finished={finishedParticipants}
            />
          </div>

          <ActionButtons
            mic={mic}
            camera={camera}
            chat={chat}
            present={present}
            recording={recording}
            setMic={setMic}
            setCamera={setCamera}
            setChat={setChat}
            setPresent={setPresent}
            setRecording={setRecording}
            setSettings={setSettings}
            waitingRoom={waitingRoom}
            setWaitingRoom={setWaitingRoom}
          />
        </div>
      </StreamCall>
    </StreamVideo>
  );
};

export default Meet;
