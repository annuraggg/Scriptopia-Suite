import { useState } from "react";
import {
  Card,
  Progress,
} from "@nextui-org/react";

import {
  CircleUserIcon,
  FileTextIcon,
  CircleHelpIcon,
  ScanSearchIcon
} from "lucide-react";

interface StepCard {
  step: string;
  title: string;
  icon: JSX.Element;
}

const Apply = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const cards: StepCard[] = [
    {
      step: "Step 1",
      title: "Contact Info",
      icon: <CircleUserIcon size={24} />,
    },
    {
      step: "Step 2",
      title: "Resume",
      icon: <FileTextIcon size={24} />,
    },
    {
      step: "Step 3",
      title: "Additional Questions",
      icon: <CircleHelpIcon size={24} />,
    },
    {
      step: "Step 4",
      title: "Review",
      icon: <ScanSearchIcon size={24} />,
    }
  ];

  const handleCardClick = (index: number) => {
    if (index <= currentStep + 1) {
      if (index < currentStep) {
        // Moving backwards
        setCurrentStep(index);
        setCompletedSteps(prevSteps => prevSteps.filter(step => step <= index));
      } else {
        // Moving forwards or staying on the same step
        setCurrentStep(index);
        if (!completedSteps.includes(index)) {
          setCompletedSteps(prevSteps => [...prevSteps, index]);
        }
      }
    }
  };

  const isStepCompleted = (index: number) => completedSteps.includes(index);

  const progressValue = ((completedSteps.length) / cards.length) * 100;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="items-center justify-between h-screen w-[65%] p-20">
        <div className="flex flex-col items-start justify-between gap-2">
          <p className="text-gray-500">Step {currentStep + 1} of {cards.length}</p>
          <Progress
            aria-label="Application Progress"
            size="md"
            value={progressValue}
            color="success"
            className="max-w-md"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-10">
          {cards.map((card, index) => (
            <Card
              isPressable={true}
              key={index}
              className={`flex items-start justify-center w-full h-32 p-4 gap-6 cursor-pointer transition-colors duration-300 ${
                isStepCompleted(index) && index <= currentStep 
                  ? 'bg-green-600 bg-opacity-20 text-green-500' 
                  : ''
              }`}
              onPress={() => handleCardClick(index)}
            >
              <h1 className={`text-sm font-bold ${isStepCompleted(index) && index <= currentStep ? 'text-green-500' : 'text-slate-500'}`}>
                {card.step}
              </h1>
              <div className="flex flex-row items-center justify-center gap-2">
                {card.icon}
                <p className="">{card.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Apply;