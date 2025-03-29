import React from "react";

interface WorkflowScheduleProps {
  addedComponents: Component[];
}

interface Component {
  icon: React.ElementType;
  label: string;
  name: string;
  id: string;
}

const WorkflowSchedule = ({ addedComponents }: WorkflowScheduleProps) => {
  return (
    <div>
      {addedComponents?.map((component) => (
        <div key={component.id}>
          <component.icon />
          <span>{component.label}</span>
          <span>{component.name}</span>
          <span>{component.id}</span>
        </div>
      ))}
    </div>
  );
};

export default WorkflowSchedule;
