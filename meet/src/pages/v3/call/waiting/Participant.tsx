import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Check, Download, X } from "lucide-react";
import { Tooltip } from "@nextui-org/tooltip";
import { StreamVideoParticipant } from "@stream-io/video-react-sdk";

// function formatTime(date: Date) {
//   const hours = date.getHours().toString().padStart(2, "0");
//   const minutes = date.getMinutes().toString().padStart(2, "0");
//   return `${hours}:${minutes}`;
// }

const Participant = ({
  participant,
  isCurrent = false,
  finished = false,
}: {
  participant?: StreamVideoParticipant;
  isCurrent?: boolean;
  finished?: boolean;
}) => {
  return (
    <Tooltip
      content={<TooltipContent />}
      placement="left"
      classNames={{
        base: ["rounded-xl"],
        content: [""],
      }}
    >
      <div
        className={`border p-3 rounded-xl w-full mt-2
      ${
        isCurrent
          ? "border-yellow-500 border-opacity-30 bg-yellow-500 bg-opacity-15"
          : finished
          ? "border-green-500 border-opacity-30 bg-green-500 bg-opacity-15"
          : "border"
      }
    `}
      >
        <div className="flex w-full justify-between items-center cursor-pointer">
          <div
            className={`flex gap-3 ${
              !isCurrent && !finished ? "w-[65%]" : "w-full"
            }`}
          >
            {/* <Avatar src={participant?.photo} className="min-w-10 min-h-10" /> */}
            <div className="overflow-hidden">
              <p
                className={`${
                  !isCurrent && !finished ? "max-w-[80%]" : "max-w-[100%]"
                } truncate overflow-ellipsis`}
              >
                {participant?.name}
              </p>
              {/* <p
                className={`${
                  !isCurrent && !finished ? "max-w-[80%]" : "max-w-[100%]"
                } truncate overflow-ellipsis text-xs opacity-50 font-light`}
              >
                {participant?.email}
              </p> */}
            </div>
          </div>
          <div className="flex gap-2">
            {!isCurrent && !finished && (
              <>
                <Button isIconOnly size="sm" color="danger" variant="flat">
                  <X size={14} />
                </Button>
                <Button isIconOnly size="sm" color="success" variant="flat">
                  <Check size={14} />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-4 opacity-50 font-light">
          {/* {participant?.joinedAt && (
            <p className="text-xs">
              Joined: {formatTime(participant?.joinedAt)}
            </p>
          )} */}
          {/* {participant?.scheduledAt && !isCurrent && (
            <p className="text-xs text-green-400 font-light">
              Scheduled: {formatTime(participant?.scheduledAt)}
            </p>
          )} */}
        </div>
      </div>
    </Tooltip>
  );
};

const TooltipContent = () => {
  return (
    <div className=" py-2 max-h-[50vw] min-w-[20vw] max-w-[50vw] flex flex-col items-center gap-3">
      <Table removeWrapper>
        <TableHeader>
          <TableColumn>Workflow Name</TableColumn>
          <TableColumn>Score</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Workflow 1</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Workflow 2</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Button
        className="w-full flex justify-between items-center"
        variant="flat"
        onClick={() => {
          alert("Jaana Chutiye");
        }}
      >
        Download Resume <Download size={16} />
      </Button>
    </div>
  );
};

export default Participant;
