import { motion } from "framer-motion";
import { Input, Select, SelectItem, Switch } from "@nextui-org/react";
import { useEffect } from "react";
import TagsInput from "react-tagsinput";
import Quill from "quill";
import "quill/dist/quill.core.css";
import { Delta } from "quill/core";
import 'react-tagsinput/react-tagsinput.css';
import { useMutation } from '@tanstack/react-query';
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";

interface ProblemData {
  title: string;
  description: Record<string, any>;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  isPrivate: boolean;
}
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
  const { getToken } = useAuth();
  const axios = ax(getToken);

  const createProblem = async (problemData: ProblemData) => {
    const response = await axios.post('/problems', problemData);
    return response.data;
  };

  const createProblemMutation = useMutation({
    mutationFn: createProblem,
    onSuccess: (data) => {
      console.log('Problem created:', data);
    },
    onError: (error) => {
      console.error('Error creating problem:', error);
    },
  });

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

  const handleSubmit = () => {
    const problemData: ProblemData = {
      title,
      description: description.ops,
      difficulty: difficulty.toLowerCase() as "easy" | "medium" | "hard",
      tags,
      isPrivate,
    };

    createProblemMutation.mutate(problemData);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
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
