import MyVideo from "./MyVideo";

import {
  ParticipantView,
  useCallStateHooks,
  hasScreenShare,
} from "@stream-io/video-react-sdk";

const User = ({ isOpen }: { isOpen: boolean }) => {
  const { useParticipants } = useCallStateHooks();
  const [participantInSpotlight ] = useParticipants();

  return (
    <div
      className={`h-full border relative flex items-center justify-center transition-all duration-700 rounded-xl bg-card ml-5 ${
        isOpen ? "w-[74vw]" : "w-full mr-5"
      }`}
    >
      <div className="speaker-view">
        <div className="spotlight">
          {participantInSpotlight && (
            <ParticipantView
              participant={participantInSpotlight}
              trackType={
                hasScreenShare(participantInSpotlight)
                  ? "screenShareTrack"
                  : "videoTrack"
              }
            />
          )}
        </div>
      </div>
      <MyVideo />
    </div>
  );
};

export default User;
