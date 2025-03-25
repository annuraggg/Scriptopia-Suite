import { motion } from "framer-motion";
import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { useEffect } from "react";
import TagsInput from "react-tagsinput";
import Quill from "quill";
import "quill/dist/quill.core.css";
import { Delta } from "quill/core";
import "react-tagsinput/react-tagsinput.css";

const Details = ({
  title,
  setTitle,
  isPrivate,
  setIsPrivate,
  difficulty,
  setDifficulty,
  tags,
  setTags,
  description,
  setDescription,
}: {
  title: string;
  setTitle: (title: string) => void;
  isPrivate: boolean;
  setIsPrivate: (isPrivate: boolean) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  description: Delta;
  setDescription: (description: Delta) => void;
}) => {
  useEffect(() => {
    const quill = new Quill("#editor", {
      theme: "snow",
      placeholder: "Write your problem description here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3] }],
          ["bold", "italic", "underline", "strike"],
          ["code-block"],
          ["link", "image"],
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          ["clean"],
        ],
      },
    });

    quill.setContents(description);
    quill.on("text-change", () => {
      setDescription(quill.getContents());
    });

    return () => {
      quill.off("text-change");
    };
  }, []);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-5 text-xs overflow-y-auto h-full">
        <p className="mt-2 opacity-50 mb-3">Note: The Problem you will create will only be visible to you and can only be used in assessments you create. Problems are not Transferable</p>
        <div className="flex gap-5">
          <Input
            label="Problem Title"
            isRequired
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Switch
            className="w-full lg:hidden md:hidden sm:hidden"
            size="sm"
            isSelected={isPrivate}
            onValueChange={(e) => setIsPrivate(e)}
          >
            Is this a Private Question
          </Switch>
        </div>
        <div className="flex gap-5 mt-5">
          <Select
            label="Difficulty"
            isRequired
            selectedKeys={[difficulty]}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <SelectItem key="easy" >
              Easy
            </SelectItem>
            <SelectItem key="medium">
              Medium
            </SelectItem>
            <SelectItem key="hard" >
              Hard
            </SelectItem>
          </Select>
          <TagsInput value={tags} onChange={(tags) => setTags(tags)} />
        </div>

        <div className="h-[40vh] w-full mt-5 rounded-lg">
          <div id="editor" className="bg-card w-full"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Details;
