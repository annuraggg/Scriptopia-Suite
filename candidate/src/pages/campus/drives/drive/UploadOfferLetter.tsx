import { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react";
import {
  IconUpload,
  IconX,
  IconFileDescription,
  IconPhoto,
} from "@tabler/icons-react";

interface UploadOfferLetterProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpload: (file: File) => void;
  title?: string;
  isLoading?: boolean; // New prop to handle loading state
}

const UploadOfferLetter: React.FC<UploadOfferLetterProps> = ({
  isOpen,
  onOpenChange,
  onUpload,
  title = "Upload File",
  isLoading = false, // Default to false
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
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
    if (file) {
      onUpload(file);
      // Note: Not calling handleReset here because we want to keep the file while loading
      // The reset will happen when the modal closes or when the upload is complete
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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open && !isLoading) handleReset(); // Only reset if not loading
        if (!isLoading) onOpenChange(open); // Only allow close if not loading
      }}
      isDismissable={!isLoading} // Prevent dismissal during loading
      hideCloseButton={isLoading} // Hide close button during loading
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                isDisabled={isLoading} // Disable during loading
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={!file || !!error || isLoading} // Disable during loading
                isLoading={isLoading} // Show loading state
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
