import { CallingState, useCalls } from "@stream-io/video-react-sdk";
import { toast } from "sonner";

const Waiting = () => {
  const calls = useCalls();

  const incomingCalls = calls.filter(
    (call) =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING
  );
  const [incomingCall] = incomingCalls;
  if (incomingCall) {
    toast("Incoming Interview Call", {
      duration: 30000,
      action: {
        label: "Answer",
        onClick: async () => {
          await incomingCall.join();
        },
      },
      cancel: {
        label: "Decline",
        onClick: () => {
          incomingCall.leave();
        },
      },
    });
  }

  return (
    <div>
      "Please wait here. You will receive a call when the interviewer calls"    
    </div>
  );
};

export default Waiting;
