import { Textarea } from "@heroui/react";
interface AdditionalQuestionsProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const AdditionalQuestions = ({ query, setQuery }: AdditionalQuestionsProps) => {
  return (
    <div className="flex flex-cols-2 items-center justify-between h-full w-full gap-6">
      <div className="flex flex-col items-center justify-start gap-2 w-full h-full">
        <div className="flex flex-col items-start justify-start gap-2 w-full h-full mt-5">
          <label className="text-base">Do you have any queries?</label>
          <Textarea
            variant="flat"
            placeholder="Enter your description"
            disableAnimation
            disableAutosize
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            classNames={{
              base: "max-w-full",
              input: "resize-y min-h-[70px]",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalQuestions;
