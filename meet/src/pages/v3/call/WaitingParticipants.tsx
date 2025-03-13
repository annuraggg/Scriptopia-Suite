import { Button, Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface WaitingUser {
  id: string;
  name: string;
}

interface WaitingParticipantsProps {
  open: boolean;
  waitingList: Set<WaitingUser>;
  acceptParticipant: (userId: string) => void;
}

const WaitingParticipants = ({
  open,
  waitingList,
  acceptParticipant,
}: WaitingParticipantsProps) => {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true); // Show component immediately
      setTimeout(() => setIsVisible(true), 10); // Delay animation slightly
    } else {
      setIsVisible(false); // Start exit animation
      setTimeout(() => setShouldRender(false), 700); // Remove from DOM after exit
    }
  }, [open]);

  if (!shouldRender) return null; // Remove from DOM after exit animation

  return (
    <div
      className={`border w-[400px] h-[80vh] rounded-2xl p-5 transition-all duration-700 ease-in-out
        ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-[400px] opacity-0"
        }
      `}
    >
      Waiting Room
      {Array.from(waitingList).map((user) => (
        <Card key={user.id} className="mt-3">
          <CardBody className="flex justify-between items-center flex-row ">
            {user.name}
            <Button onPress={() => acceptParticipant(user.id)}>Accept</Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default WaitingParticipants;
