import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Card,
  CardBody,
  CardHeader,
  Pagination,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";

const Carousel = ({ mcqs }: { mcqs: any[] }) => {
  const [index, setIndex] = useState(1);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-5 mb-3">
      <Card className="w-full border drop-shadow-sm min-h-[25vh]">
        <CardHeader className="flex justify-between items-center gap-3 flex-row w-full px-6">
          <p>{mcqs[index - 1].question}</p>
          {mcqs[index - 1]?.correct && (
            <p className="text-xs text-green-500">
              Correct Answer:{" "}
              {mcqs[index - 1].type === "multiple"
                ? mcqs[index - 1].correct[0]
                : mcqs[index - 1].correct.join(", ")}
            </p>
          )}
        </CardHeader>
        <CardBody>
          {mcqs[index - 1].type === "multiple" ||
          mcqs[index - 1].type === "checkbox" ? (
            <ToggleGroup
              type={mcqs[index - 1].type === "multiple" ? "single" : "multiple"}
              value={
                mcqs[index - 1].type === "multiple"
                  ? mcqs[index - 1].selected[0]
                  : mcqs[index - 1].selected
              }
            >
              <div
                className="flex gap-3 w-full flex-wrap items-center justify-center"
                key={index}
              >
                {mcqs[index - 1].options.map((option: string, index: number) => (
                  <ToggleGroupItem
                    key={index}
                    value={option}
                    className="min-w-[48%] opacity-100 data-[state=on]:bg-green-6 data-[state=on]:bg-green-600 data-[state=on]:bg-opacity-20 data-[state=on]:text-green-500 border-2 p-5 bg-gray-100 bg-opacity-10"
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </div>
            </ToggleGroup>
          ) : (
            <Textarea value={mcqs[index - 1]?.answer} readOnly rows={3} />
          )}
        </CardBody>
      </Card>
      <Pagination
        isCompact
        showControls
        total={mcqs.length}
        page={index}
        onChange={setIndex}
      />
    </div>
  );
};

export default Carousel;
