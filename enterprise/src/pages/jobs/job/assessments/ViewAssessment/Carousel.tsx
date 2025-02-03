import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Card,
  CardBody,
  CardHeader,
  Pagination,
  Textarea,
} from "@heroui/react";

interface MCQ {
  question: string;
  type: string;
  options: string[];
  selected: string[];
  correct: string[];
  grade: number;
}

const Carousel = ({
  mcqs,
  index,
  setIndex,
}: {
  mcqs: MCQ[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    (<div className="w-full flex items-center justify-center flex-col gap-5 mb-3">
      <Card className="w-full border drop-shadow-sm min-h-[25vh]">
        <CardHeader className="flex-col justify-start items-start px-6">
          {mcqs[index - 1].grade > 0 && (
            <b>
              Grade Received:{" "}
              {mcqs[index - 1].correct?.join(", ") ===
              mcqs[index - 1]?.selected?.join(", ")
                ? mcqs[index - 1]?.grade
                : 0}
            </b>
          )}
          <div className="flex justify-between items-center flex-row w-full flex-wrap mt-5">
            <p>{mcqs[index - 1]?.question}</p>
            {mcqs[index - 1]?.correct?.length > 0 && (
              <p className="text-xs text-green-500">
                Correct Answer(s):{" "}
                {mcqs[index - 1]?.type === "multiple"
                  ? mcqs[index - 1]?.correct[0]
                  : mcqs[index - 1]?.correct?.join(", ")}
              </p>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {mcqs[index - 1]?.type === "multiple" ||
          mcqs[index - 1]?.type === "checkbox" ? (
            // @ts-expect-error - Fix this
            (<ToggleGroup
              type={mcqs[index - 1]?.type === "multiple" ? "single" : "multiple"}
              value={
                mcqs[index - 1]?.type === "multiple"
                  ? mcqs[index - 1]?.selected[0]
                  : mcqs[index - 1]?.selected
              }
            >
              <div
                className="flex gap-3 flex-wrap items-center justify-center"
                key={index}
              >
                {mcqs[index - 1]?.options?.map(
                  (option: string, index: number) => (
                    <ToggleGroupItem
                      key={index}
                      value={option}
                      className="min-w-[48%] max-w-[48%] opacity-100 data-[state=on]:bg-green-6 data-[state=on]:bg-green-600 data-[state=on]:bg-opacity-20 data-[state=on]:text-green-500 border-2 p-5 py-10 bg-gray-100 bg-opacity-10"
                    >
                      {option}
                    </ToggleGroupItem>
                  )
                )}
              </div>
            </ToggleGroup>)
          ) : (
            <Textarea value={mcqs[index - 1]?.selected[0]} readOnly rows={3} />
          )}
        </CardBody>
      </Card>
      <Pagination
        isCompact
        showControls
        total={mcqs?.length}
        page={index}
        onChange={setIndex}
      />
    </div>)
  );
};

export default Carousel;
