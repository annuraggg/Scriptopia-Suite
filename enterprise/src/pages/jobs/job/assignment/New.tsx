import { Input, Textarea, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Posting } from "@shared-types/Posting";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

const New = () => {
  const { posting } = useOutletContext() as { posting: Posting };

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    console.log(posting);
    if (posting) {
      const step = new URLSearchParams(window.location.search).get("step");
      const assignment = posting?.workflow?.steps?.[Number(step)];
      setName(assignment?.name || "");
    }
  }, [posting]);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const handleCreateAssignment = () => {
    axios
      .post("/postings/assignment", {
        name,
        description,
        postingId: posting._id,
      })
      .then(() => {
        toast.success("Assignment created successfully");
        const newLOC = window.location.pathname.split("/").slice(0, 3).join("/");
        window.location.href = newLOC;
      })
      .catch((err) => {
        toast.error(err.response.data || "An error occurred");
        console.log(err.response.data);
      });
  };

  return (
    <div className="flex gap-10 h-full p-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col justify-start h-full"
      >
        <Input label="Assignment Name" value={name} isDisabled />
        <Textarea
          className="mt-5"
          minRows={10}
          label="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-5 mt-10">
          {/* Additional inputs if needed */}
        </div>
      </motion.div>

      <Button
        color="success"
        className="absolute bottom-14 right-14 px-6 py-3"
        onClick={handleCreateAssignment}
      >
        Create Assignment
      </Button>
    </div>
  );
};

export default New;
