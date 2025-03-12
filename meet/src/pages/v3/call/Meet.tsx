import { useEffect, useState } from "react";
import ActionButtons from "./ActionButtons";
import {
  Call,
  PermissionRequestEvent,
  StreamCallEvent,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { toast } from "sonner";
import ParticipantGrid from "./ParticipantGrid";
import WaitingParticipants from "./WaitingParticipants";

interface WaitingUser {
  id: string;
  name: string;
}

interface MeetProps {
  call: Call;
  client: any;
  waitingList: WaitingUser[];
  acceptParticipant: (userId: string) => void;
}

const Meet = ({ call, waitingList, acceptParticipant }: MeetProps) => {
  const [_isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  useEffect(() => {
    call.on("call.permission_request", async (event: StreamCallEvent) => {
      const request = event as PermissionRequestEvent;
      if (request.user.id === call.currentUserId) return;

      if (request.permissions.includes("screenshare")) {
        toast("The interviewee is requesting to share their screen", {
          action: {
            label: "Accept",
            onClick: () =>
              call.grantPermissions(request.user.id, request.permissions),
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log(participants);
  }, [participants]);

  return (
    <>
      <div className="h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="p-8 h-full flex items-center justify-center gap-10 transition-all duration-700">
          <div
            className={`transition-all duration-700 ${
              isParticipantsOpen ? "w-[calc(100%-420px)]" : "w-full"
            }`}
          >
            <ParticipantGrid participants={participants} />
          </div>
          <WaitingParticipants
            open={isParticipantsOpen}
            waitingList={waitingList}
            acceptParticipant={acceptParticipant}
          />
        </div>
      </div>

      <ActionButtons
        call={call}
        onChatToggle={setIsChatOpen}
        participantsOpen={isParticipantsOpen}
        setParticipantsOpen={setIsParticipantsOpen}
      />
    </>
  );
};

export default Meet;
