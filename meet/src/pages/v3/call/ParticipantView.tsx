import {
  ParticipantView,
  StreamVideoParticipant,
} from "@stream-io/video-react-sdk";

interface ParticipantProps {
  participant: StreamVideoParticipant;
}

const ParticipantViewMain = ({ participant }: ParticipantProps) => {
  return <ParticipantView participant={participant} />;
};

export default ParticipantViewMain;
