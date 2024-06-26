import { motion } from "framer-motion";
import { Input, Select, SelectItem, Switch } from "@nextui-org/react";
import { useEffect } from "react";
import TagsInput from "react-tagsinput";
import Quill from "quill";
import "quill/dist/quill.core.css";
import { Delta } from "quill/core";
import 'react-tagsinput/react-tagsinput.css'

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
          [{ header: 1 }, { header: 2 }, { header: 3 }], // custom button values
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["code-block"],
          ["link", "image"],

          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          ["clean"],
        ],
      },
    });

    quill.setContents(description);
    quill.on("text-change", () => {
      console.log("text-change");
      setDescription(quill.getContents());
    });

    return () => {
      quill.off("text-change");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className=""
  >
    <div className="px-5 py-2 text-xs overflow-y-auto h-full">
      <div className="flex gap-5">
        <Input
          label="Problem Title"
          isRequired
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Switch
          className="w-full"
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
          <SelectItem key="easy" value="Easy">
            Easy
          </SelectItem>
          <SelectItem key="medium" value="Medium">
            Medium
          </SelectItem>
          <SelectItem key="hard" value="Hard">
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
