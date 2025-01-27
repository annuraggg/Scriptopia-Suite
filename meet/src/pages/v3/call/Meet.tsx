import { useState } from "react";
import ActionButtons from "./ActionButtons";
import { Call, PaginatedGridLayout } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
interface MeetProps {
  call: Call;
  client: any;
}

const Meet = ({ call }: MeetProps) => {
  const [_isChatOpen, setIsChatOpen] = useState(false);
  const [_isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="h-[85vh] flex items-center justify-center">
        <PaginatedGridLayout />
      </div>
      <ActionButtons
        call={call}
        onChatToggle={setIsChatOpen}
        onSettingsToggle={setIsSettingsOpen}
      />
    </>
  );
};

export default Meet;
