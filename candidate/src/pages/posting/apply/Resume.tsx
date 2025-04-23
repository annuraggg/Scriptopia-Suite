import React, { useRef } from "react";
import { Card, Button } from "@heroui/react";
import { LinkIcon, FileIcon, XIcon } from "lucide-react";

interface ResumeProps {
  resume: File | null;
  setResume: React.Dispatch<React.SetStateAction<File | null>>;
}

const Resume = ({ resume, setResume }: ResumeProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        setResume(file);
      } else {
        alert("File size exceeds 2MB limit.");
      }
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-start justify-start h-full w-full gap-6">
      <div className="flex flex-col items-start justify-center gap-1 w-full">
        <p className="text-2xl">Resume*</p>
        <p className="text-sm text-neutral-400">
          Make certain to submit an updated resume
        </p>
      </div>

      {resume && (
        <Card className="p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FileIcon size={20} />
              <span className="text-sm truncate">{resume.name}</span>
            </div>
            <Button
              size="sm"
              variant="light"
              onClick={handleRemoveFile}
              className="min-w-unit-0 p-0"
            >
              <XIcon size={20} />
            </Button>
          </div>
        </Card>
      )}

      <div className="flex flex-col items-start justify-center gap-4 w-full">
        <input
          type="file"
          accept=".doc,.docx,.pdf"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          className="text-green-500 flex items-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <LinkIcon size={20} className="mr-2" />
          Upload Resume
        </Button>
        <p className="text-sm text-neutral-400">
          DOC/DOCX/PDF (2MB), MAX 1 Attachment
        </p>

        {/* {exists && (
          <p className="text-sm text-warning-500">
            We already have an old resume on file. If you want to update it, you
            can upload a new one, otherwise, you can proceed with the old one
            and leave this field blank.
          </p>
        )} */}
      </div>
    </div>
  );
};

export default Resume;
