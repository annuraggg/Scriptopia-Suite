import {
  Card,
  Accordion,
  AccordionItem,
  Button,
  Avatar,
} from "@nextui-org/react";
import { Candidate } from "@stypes/Candidate";
import { ExtendedMeet } from "@stypes/ExtendedMeet";
import { FileSpreadsheet, User } from "lucide-react";
import { useEffect, useState } from "react";

interface ParticipantsProps {
  open: boolean;
  acceptParticipant: (userId: string) => void;
  meeting: ExtendedMeet;
  waitingList: string[];
  current: string;
}

const Participants = ({
  open,
  acceptParticipant,
  meeting,
  waitingList,
  current,
}: ParticipantsProps) => {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setShouldRender(true); // Show component immediately
      setTimeout(() => setIsVisible(true), 10); // Delay animation slightly
      const currentC = meeting.candidates.find((c) => c.userId === current);
      if (currentC) setCurrentCandidate(currentC);
    } else {
      setIsVisible(false); // Start exit animation
      setTimeout(() => setShouldRender(false), 700); // Remove from DOM after exit
    }
  }, [open, current]);

  if (!shouldRender) return null; // Remove from DOM after exit animation

  // Remove duplicates from candidates array using userId as the unique identifier
  const uniqueCandidates = meeting.candidates
    ? Array.from(
        new Map(meeting.candidates.map((item) => [item.userId, item])).values()
      )
    : [];

  // Filter candidates for each section
  const waitingCandidates = uniqueCandidates.filter((user) =>
    waitingList.includes(user.userId!)
  );

  const notJoinedCandidates = uniqueCandidates.filter(
    (user) =>
      !waitingList.includes(user.userId!) &&
      current !== user._id &&
      current !== user.userId &&
      meeting.completed.filter((c) => c.userId === user._id).length === 0
  );

  const completedCandidates = meeting.completed
    .map((completedUser) => {
      return uniqueCandidates.find(
        (participant) => participant._id === completedUser.userId
      );
    })
    .filter(Boolean) as Candidate[];

  return (
    <Card
      className={`border w-[400px] h-[80vh] rounded-2xl p-5 transition-all duration-700 ease-in-out
        ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-[400px] opacity-0"
        }
      `}
    >
      <p>Participants</p>

      {current && (
        <div className="mt-3">
          <p>Current Candidate</p>
          <div className="flex mt-3 h-20 items-center justify-between bg-zinc-800  py-2 border-green-800 border-opacity-50 border-3 p-3 rounded-2xl ">
            <div className="flex gap-3 items-center justify-center">
              <Avatar />
              <div>
                <p>{currentCandidate?.name}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button isIconOnly>
                <User size={24} />
              </Button>{" "}
              <Button isIconOnly>
                <FileSpreadsheet size={24} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Accordion selectionMode="multiple" isCompact className="mt-3" defaultExpandedKeys={["1"]}>
        <AccordionItem
          key="1"
          aria-label="Waiting Participants"
          title="Waiting Participants"
        >
          {waitingCandidates.length > 0 ? (
            waitingCandidates.map((user) => (
              <div
                key={user._id!}
                className="flex items-center justify-between bg-zinc-800 mb-3 p-2 px-3 rounded-2xl"
              >
                <p>{user?.name}</p>
                <Button
                  onClick={() => acceptParticipant(user.userId!)}
                  color="success"
                  variant="light"
                >
                  Accept
                </Button>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-2 text-gray-400">
              No candidates waiting
            </div>
          )}
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Not Yet Joined"
          title="Not Yet Joined"
        >
          {notJoinedCandidates.length > 0 ? (
            notJoinedCandidates.map((user) => (
              <div
                key={user._id!}
                className="flex items-center justify-between bg-zinc-800 mb-3 p-2 px-3 rounded-2xl"
              >
                <p>{user?.name}</p>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-2 text-gray-400">
              No candidates pending
            </div>
          )}
        </AccordionItem>
        <AccordionItem key="3" aria-label="Completed" title="Completed">
          {completedCandidates.length > 0 ? (
            completedCandidates.map((user) => (
              <div
                key={user._id!}
                className="flex items-center justify-between bg-zinc-800 mb-3 p-2 px-3 rounded-2xl"
              >
                <p>{user?.name}</p>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-2 text-gray-400">
              No completed interviews
            </div>
          )}
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default Participants;
