import { Call, StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { Button } from "@nextui-org/react";

const Waiting = ({
  isOpen,
  participants,
  call,
}: {
  isOpen: boolean;
  participants?: StreamVideoParticipant[];
  call: Call;
}) => {
  console.log(participants);
  return (
    <div
      className={`${
        isOpen ? " translate-x-0" : "translate-x-[110%]"
      } duration-300 border translate-all animate__animated overflow-y-auto rounded-xl absolute right-5 h-full max-h-[80vh] bg-card p-3 w-[350px]`}
    >
      <p className="opacity-50">Current</p>
      <Button
        onClick={() => {
          call.ring();
        }}
      >
        Ring
      </Button>
    </div>
  );
};

export default Waiting;
