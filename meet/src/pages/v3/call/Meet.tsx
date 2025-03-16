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
import Participants from "./Participants";
import { ExtendedMeet } from "@stypes/ExtendedMeet";

interface MeetProps {
  call: Call;
  client: any;
  waitingList: string[];
  acceptParticipant: (userId: string) => void;
  role: string;
  meeting: ExtendedMeet;
  current: string;
}

const Meet = ({
  call,
  waitingList,
  acceptParticipant,
  role,
  meeting,
  current
}: MeetProps) => {
  const [_isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const { useParticipants } = useCallStateHooks();

  const streamParticipants = useParticipants();

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

  return (
    <>
      <div className="h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="h-full flex items-center justify-center gap-10 transition-all duration-700 px-5 w-full">
          <div
            className={`transition-all duration-700 ${
              isParticipantsOpen ? "w-[calc(100%-420px)]" : "w-full"
            }`}
          >
            <ParticipantGrid participants={streamParticipants} />
          </div>
          <Participants
            open={isParticipantsOpen}
            meeting={meeting}
            waitingList={waitingList}
            current={current}
            acceptParticipant={acceptParticipant}
          />
        </div>
      </div>

      <ActionButtons
        call={call}
        onChatToggle={setIsChatOpen}
        participantsOpen={isParticipantsOpen}
        setParticipantsOpen={setIsParticipantsOpen}
        role={role}
      />
    </>
  );
};

export default Meet;
