import { useState } from "react";
import { Card, Button, Input, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Section } from "@shared-types/MCQAssessment";

interface McqSidebarProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  onSectionSelect: (section: Section) => void;
  selectedSectionIndex: number | null;
}

const McqSidebar = ({
  sections,
  setSections,
  onSectionSelect,
  selectedSectionIndex,
}: McqSidebarProps) => {
  const [newSectionName, setNewSectionName] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddSection = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSectionName.trim()) {
      const newSection: Section = {
        name: newSectionName,
        questions: [],
      };
      setSections([...sections, newSection]);
      setNewSectionName("");
      setIsAddingNew(false);
    }
  };

  const handleDeleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setSections(
      sections.map((section, i) =>
        i === index ? { ...section, isEditing: true } : section
      )
    );
  };

  const handleEdit = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const newName = (e.target as HTMLInputElement).value.trim();
      if (newName) {
        setSections(
          sections.map((section, i) =>
            i === index
              ? { ...section, name: newName, isEditing: false }
              : section
          )
        );
      }
    }
  };

  const handleSectionClick = (section: Section) => {
    if (!(section as any).isEditing) {
      onSectionSelect(section);
    }
  };

  const saveSection = () => {
    if (newSectionName.trim()) {
      const newSection: Section = {
        name: newSectionName,
        questions: [],
      };
      setSections([...sections, newSection]);
      setNewSectionName("");
      setIsAddingNew(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[20%] h-full"
    >
      <Card className="h-full rounded-xl border-none shadow-none">
        <CardHeader className="flex flex-col items-start pt-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold">Sections</h3>
            <span className="text-xs text-gray-500">({sections.length})</span>
          </div>
          <p className="text-sm text-gray-500">Manage your MCQ sections</p>
        </CardHeader>
        <div className="mt-2 space-y-2 overflow-y-auto flex-grow">
          {sections.map((section, index) => (
            <Card
              key={index}
              isHoverable
              isPressable
              className={`w-full flex items-center justify-center p-3 cursor-pointer shadow-none border-1 ${
                selectedSectionIndex === index ? "bg-primary/10" : ""
              }`}
              onClick={() => handleSectionClick(section)}
            >
              {(section as any).isEditing ? (
                <Input
                  defaultValue={section.name}
                  className="w-full"
                  onKeyDown={(e) => handleEdit(index, e)}
                  autoFocus
                />
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="overflow-hidden">
                    <div
                      className={`text-sm whitespace-nowrap ${
                        section.name.length > 20 ? "animate-marquee" : ""
                      }`}
                    >
                      {section.name}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(index);
                      }}
                      className="p-1 hover:bg-zinc-500 rounded-full transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(index);
                      }}
                      className="p-1 hover:bg-zinc-500 rounded-full transition-colors text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}

          {isAddingNew ? (
            <Card className="w-full h-10 flex items-center justify-center px-3">
              <Input
                placeholder="Enter section name and press Enter"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyDown={handleAddSection}
                onBlur={saveSection}
                size="sm"
                autoFocus
                className="w-full"
              />
            </Card>
          ) : (
            <Button
              onClick={() => setIsAddingNew(true)}
              className="w-full"
              startContent={<Plus size={16} />}
            >
              Add Section
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default McqSidebar;
