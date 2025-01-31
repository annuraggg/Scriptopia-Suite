import React from "react";
import {
  ParticipantView,
  StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@nextui-org/react";

interface GridProps {
  participants: StreamVideoParticipant[];
}

const ParticipantGrid = ({ participants }: GridProps) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const participantsPerPage = 6;
  const totalPages = Math.ceil(participants.length / participantsPerPage);

  const paginatedParticipants = participants.slice(
    currentPage * participantsPerPage,
    (currentPage + 1) * participantsPerPage
  );

  const getGridClassName = () => {
    const count = paginatedParticipants.length;
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      case 4:
        return "grid-cols-2";
      case 5:
      case 6:
        return "grid-cols-3";
      default:
        return "grid-cols-3";
    }
  };

  const getItemClassName = (index: number) => {
    const count = paginatedParticipants.length;
    if (count === 3 && index === 2) return "col-span-2";
    if (count === 4 && index >= 2) return "col-span-1";
    return "";
  };

  return (
    <div className="relative w-full h-full" >
      <div className={`grid ${getGridClassName()} gap-4 h-full flex items-center justify-center`}>
        {paginatedParticipants.map((participant, index) => (
          <div
            key={participant.sessionId}
            className={`relative aspect-video max-h-[70vh] ${getItemClassName(index)}`}
          >
            <ParticipantView
              participant={participant}
              className="w-full h-full rounded-lg overflow-hidden"
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full">
          <Button
            variant="ghost"
            isIconOnly
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-white text-sm">
            {currentPage + 1} / {totalPages}
          </span>

          <Button
            variant="ghost"
            isIconOnly
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ParticipantGrid;
