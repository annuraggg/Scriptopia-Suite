import React from "react";
import { Card, Button } from "@heroui/react";
import { ArrowUp, ArrowDown, Trash, Edit } from "lucide-react";
import { Question } from "@shared-types/MCQAssessment";
interface QuestionListProps {
  questions: Question[];
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="h-full overflow-y-auto pr-4 ">
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question._id} className="p-4 shadow-none border-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">
                  {question?.type
                    ?.split("-")
                    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    ?.join(" ")}{" "}
                  (Grade: {question.grade})
                </p>
                <h3 className="font-semibold text-lg">{question.question}</h3>{" "}
                {/* Updated to use 'question' instead of 'text' */}
              </div>
              <div className="flex">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => onMoveUp(question?._id || "")}
                  isDisabled={index === 0}
                >
                  <ArrowUp size={18} />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => onMoveDown(question?._id || "")}
                  isDisabled={index === questions.length - 1}
                >
                  <ArrowDown size={18} />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  color="primary"
                  onPress={() => onEdit(index)}
                >
                  <Edit size={18} />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  color="danger"
                  onPress={() => onDelete(index)}
                >
                  <Trash size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
