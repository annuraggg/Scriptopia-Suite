import Participant from "./Participant";
import { Accordion, AccordionItem } from "@nextui-org/react";

interface participantsProps {
  name: string;
  email: string;
  photo: string;
  _id: string;
  joinedAt: Date;
  scheduledAt: Date;
}

const Waiting = ({
  isOpen,
  current,
  waiting,
  finished,
}: {
  isOpen: boolean;
  current: participantsProps;
  waiting: participantsProps[];
  finished: participantsProps[];
}) => {
  return (
    <div
      className={`${
        isOpen ? " translate-x-0" : "translate-x-[110%]"
      } duration-300 border translate-all animate__animated overflow-y-auto rounded-xl absolute right-5 h-full bg-card p-3 w-[350px]`}
    >
      <p className="opacity-50">Current</p>
      <Participant participant={current} isCurrent={true} />

      <Accordion isCompact defaultExpandedKeys={["waiting"]}>
        <AccordionItem
          key="waiting"
          aria-label="Waiting Room"
          subtitle="Waiting Room Participants"
          className="mt-3"
        >
          {waiting.map((participant, index) => (
            <Participant key={index} participant={participant} />
          ))}
        </AccordionItem>
        <AccordionItem
          key="finished"
          aria-label="Finished Participants"
          subtitle="Finished Participants"
          className="mt-3"
        >
          {finished.map((participant, index) => (
            <Participant key={index} participant={participant} finished={true} />
          ))}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Waiting;
