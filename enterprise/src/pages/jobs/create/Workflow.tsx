import { useRef, useState } from "react";
import { FileText, Code, Edit2, Trash, Book, Copy } from "lucide-react";
import { Button, DateValue, Divider, TimeInputValue } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { motion, Reorder } from "framer-motion"; // Added framer-motion for animation

interface Component {
  icon: React.ElementType;
  label: string;
  name: string;
  id: string;
}

const Create = ({
  setAction,
  addedComponents,
  setAddedComponents,
}: {
  setAction: (page: number) => void;
  addedComponents: Component[];
  setAddedComponents: (components: Component[]) => void;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [isDragging, setIsDragging] = useState(false); // State for handling dragging status
  const [autoSchedule, setAutoSchedule] = useState<
    {
      start: DateValue | null;
      end: DateValue | null;
      startTime: TimeInputValue | null;
      endTime: TimeInputValue | null;
    }[]
  >([]);

  const components = [
    { icon: FileText, label: "ATS" },
    { icon: Copy, label: "MCQ Assessment" },
    { icon: Code, label: "Code Assessment" },
    // { icon: Combine, label: "MCQ + Code Assessment" },
    { icon: Book, label: "Assignment" },
    // { icon: MonitorPlay, label: "Interview" },
  ];

  const dragStart = (e: React.DragEvent<HTMLDivElement>, label: string) => {
    e.dataTransfer.setData("text", label);
    setIsDragging(true); // Set dragging state to true
  };

  const dragEnd = () => {
    setIsDragging(false); // Reset dragging state after drop
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // Reset dragging state on drop
    const label = e.dataTransfer.getData("text");
    const component = components.find((c) => c.label === label);

    if (component) {
      const newComponent = {
        ...component,
        name: `${component.label} ${
          addedComponents.filter((c) => c.label === component.label).length
        }`,
        id: Math.random().toString(36).substring(7),
      };

      setAddedComponents([...addedComponents, newComponent]);
      setAutoSchedule([
        ...autoSchedule,
        { start: null, end: null, startTime: null, endTime: null },
      ]);
    }
  };

  const editName = (id: string, newName: string) => {
    setAddedComponents(
      addedComponents.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  const deleteComponent = (id: string) => {
    setAddedComponents(addedComponents.filter((c) => c.id !== id));
    setAutoSchedule(
      autoSchedule.filter(
        (_, index) => index !== addedComponents.findIndex((c) => c.id === id)
      )
    );
  };

  const handleEditClick = (id: string) => {
    setEditingId(editingId === id ? null : id);
    // Auto-focus the input field if it's being edited
    if (editingId !== id) {
      setTimeout(() => {
        inputRefs.current[id]?.focus(); // Use a timeout to ensure it focuses after the state change
      }, 0);
    }
  };

  const handleBlur = (id: string, value: string) => {
    if (editingId === id) {
      editName(id, value); // Save changes on blur
      setEditingId(null); // Reset editing state
    }
  };

  return (
    <div className="w-full h-[92vh]">
      <div className="gap-10 flex justify-between">
        <div className="w-full flex flex-col gap-5">
          <Reorder.Group
            axis="y"
            values={addedComponents}
            onReorder={setAddedComponents}
            className="flex flex-col gap-5"
          >
            <p className="opacity-50">
              Drag and Drop Components from Right Side
            </p>
            {addedComponents.map((component) => (
              <Reorder.Item
                key={component.id}
                value={component}
                whileDrag={{ scale: 1.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  layout
                  className="border p-5 gap-5 rounded-xl min-h-20 flex justify-start items-center relative"
                >
                  <component.icon />
                  <div>
                    <input
                      ref={(el) => (inputRefs.current[component.id] = el)} // Assign ref to input
                      className={`border-none outline-none bg-transparent max-w-fit transition-all ${
                        editingId === component.id
                          ? "opacity-100 text-xl"
                          : "opacity-50 text-base" // Increase text size when editing
                      }`}
                      value={component.name}
                      onChange={(e) => editName(component.id, e.target.value)}
                      onBlur={() => handleBlur(component.id, component.name)} // Call onBlur handler
                      onFocus={() => setEditingId(component.id)} // Set editingId on focus
                    />
                    <p className="text-sm opacity-50 mt-2">{component.label}</p>
                  </div>
                  <Tooltip content="Delete Component">
                    <Trash
                      className="cursor-pointer absolute right-5 text-red-500"
                      size={20}
                      onClick={() => deleteComponent(component.id)}
                    />
                  </Tooltip>
                  <span>
                    <Tooltip content="Edit Name" placement="top">
                      <Edit2
                        className="cursor-pointer absolute right-16 -mt-[8px]"
                        size={20}
                        onClick={() => handleEditClick(component.id)} // Call new edit handler
                        style={{
                          transition: "transform 0.2s",
                          transform:
                            editingId === component.id
                              ? "scale(1.1)"
                              : "scale(1)",
                        }}
                      />
                    </Tooltip>
                  </span>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <motion.div
            className={`border-4 p-5 rounded-xl min-h-20 w-full flex justify-center items-center ${
              isDragging ? "border-blue-500" : "border-dashed opacity-50"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={drop}
            whileHover={{ scale: isDragging ? 1.1 : 1.05 }}
          >
            {isDragging ? "Drop here!" : "+ Add Component"}
          </motion.div>
        </div>
        <Divider orientation="vertical" className="opacity-50" />
        <div className="h-full w-[30%] flex flex-col gap-5 relative">
          {components.map((component, index) => (
            <motion.div
              key={index}
              draggable // @ts-expect-error - TS doesn't know the keys of componentMap
              onDragStart={(e) => dragStart(e, component.label)}
              onDragEnd={dragEnd}
              className="p-5 border rounded-xl cursor-pointer hover:bg-gray-800 transition-colors flex items-center gap-5"
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.1, opacity: 0.8 }}
            >
              <component.icon />
              {component.label}
            </motion.div>
          ))}
          <Button
            className="w-full mt-5"
            color="success"
            variant="flat"
            onClick={() => setAction(3)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Create;
