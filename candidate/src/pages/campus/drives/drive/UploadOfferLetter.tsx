import { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Input,
} from "@heroui/react";
import {
  IconUpload,
  IconX,
  IconFileDescription,
  IconPhoto,
} from "@tabler/icons-react";

interface UploadOfferLetterProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpload: (file: File, ctc: string) => void;
  title?: string;
  isLoading?: boolean;
  currency?: string;
}

const UploadOfferLetter: React.FC<UploadOfferLetterProps> = ({
  isOpen,
  onOpenChange,
  onUpload,
  title = "Upload File",
  isLoading = false,
  currency = "INR",
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [ctc, setCtc] = useState<string>("");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 2 * 1024 * 1024;
  const ACCEPTED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ];

  const handleDrag = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("File type not supported");
      return false;
    }

    if (file.size > MAX_SIZE) {
      setError("File must be less than 2MB");
      return false;
    }

    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = (): void => {
    if (file && isCtcValid()) {
      onUpload(file, ctc);
    }
  };

  const handleReset = (): void => {
    setFile(null);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getFileTypeIcon = (): JSX.Element => {
    if (!file) return <IconUpload size={36} />;

    if (file.type.includes("pdf")) {
      return <IconFileDescription size={36} className="text-red-500" />;
    } else if (file.type.includes("image")) {
      return <IconPhoto size={36} className="text-blue-500" />;
    } else {
      return <IconFileDescription size={36} className="text-gray-500" />;
    }
  };

  const handleCtcChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setCtc(value);
    }
  };

  const isCtcValid = (): boolean => {
    return ctc !== "" && Number(ctc) > 0;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open && !isLoading) handleReset();
        if (!isLoading) onOpenChange(open);
      }}
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Spinner size="lg" color="primary" className="mb-4" />
                  <p className="text-center">Uploading your offer letter...</p>
                  {file && (
                    <p className="text-sm text-gray-500 mt-2">
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center w-full h-52 rounded-lg border-2 border-dashed
                    ${
                      dragActive
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 bg-gray-50"
                    }
                    transition-colors duration-300`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={handleChange}
                    id="file-upload"
                  />

                  <div
                    className="flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer"
                    onClick={() => inputRef.current && inputRef.current.click()}
                  >
                    <div className="mb-3 text-gray-400">
                      {getFileTypeIcon()}
                    </div>

                    {file ? (
                      <div className="flex flex-col items-center">
                        <p className="mb-2 text-sm text-gray-500 text-center">
                          <span className="font-semibold">{file.name}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <Button
                          color="danger"
                          variant="light"
                          size="sm"
                          className="mt-2"
                          startContent={<IconX size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-gray-500 text-center">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 text-center">
                          PDF, Images, and Documents (max 2MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {error && !isLoading && (
                <div className="text-danger text-sm mt-2 text-center">
                  {error}
                </div>
              )}

              <Input
                type="text"
                label={`CTC (in ${currency})`}
                placeholder="Enter your CTC"
                value={ctc}
                onChange={handleCtcChange}
                className="mt-4"
                isDisabled={isLoading}
                isRequired
                isInvalid={
                  ctc !== "" && (Number(ctc) <= 0 || isNaN(Number(ctc)))
                }
              />
              {ctc !== "" && (Number(ctc) <= 0 || isNaN(Number(ctc))) && (
                <div className="text-danger text-sm mt-1">
                  CTC must be a positive number
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={!file || !!error || isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UploadOfferLetter;
