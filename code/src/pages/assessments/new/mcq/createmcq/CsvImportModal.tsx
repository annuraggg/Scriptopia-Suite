import React, { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Tabs, 
  Tab, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell 
} from "@heroui/react";
import { FileQuestion } from "lucide-react";

interface CSVImportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSVImportModal: React.FC<CSVImportGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>("single-multi");

  const questionTypeFormats = {
    "single-multi": {
      description: "For Single and Multiple Select Questions",
      format: [
        "type,text,options",
        "single-select,What is the capital of France?,\"[{\"id\":1,\"text\":\"Paris\",\"isCorrect\":true},{\"id\":2,\"text\":\"London\",\"isCorrect\":false}]\"",
        "multi-select,Select programming languages?,\"[{\"id\":1,\"text\":\"Python\",\"isCorrect\":true},{\"id\":2,\"text\":\"Java\",\"isCorrect\":true},{\"id\":3,\"text\":\"C++\",\"isCorrect\":false}]\""
      ]
    },
    "true-false": {
      description: "For True/False Questions",
      format: [
        "type,text,options",
        "true-false,The Earth is round?,\"[{\"id\":1,\"text\":\"True\",\"isCorrect\":true},{\"id\":2,\"text\":\"False\",\"isCorrect\":false}]\""
      ]
    },
    "short-long": {
      description: "For Short and Long Answer Questions",
      format: [
        "type,text,maxLimit",
        "short-answer,Describe your favorite hobby,70",
        "long-answer,Explain the impact of AI on society,250"
      ]
    },
    "visual": {
      description: "For Visual Questions",
      format: [
        "type,text,imageUrl",
        "visual,Identify the object in the image,https://example.com/image.jpg"
      ]
    },
    "output-peer": {
      description: "For Output and Peer Review Questions",
      format: [
        "type,text,code",
        "output,Write a function to reverse a string,\"function reverseString(str) { return str.split('').reverse().join(''); }\""
      ]
    },
    "fill-blanks": {
      description: "For Fill in the Blanks Questions",
      format: [
        "type,text,blankText,blanksAnswers",
        "fill-in-blanks,Complete the sentence,The ____ is the largest planet in our solar system.,\"[\"Jupiter\"]\"" 
      ]
    },
    "matching": {
      description: "For Matching Questions",
      format: [
        "type,text,options",
        "matching,Match the countries with their capitals,\"[{\"id\":1,\"text\":\"France\",\"matchText\":\"Paris\"},{\"id\":2,\"text\":\"Germany\",\"matchText\":\"Berlin\"}]\""
      ]
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="4xl" 
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <FileQuestion />
          CSV Import Guide
        </ModalHeader>
        <ModalBody>
          <Tabs 
            variant="underlined" 
            selectedKey={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            {Object.entries(questionTypeFormats).map(([key, details]) => (
              <Tab key={key} title={details.description}>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">CSV Format Example:</h4>
                  <Table>
                    <TableHeader>
                      <TableColumn>Line</TableColumn>
                      <TableColumn>Content</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {details.format.map((line, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono">
                            {index === 0 ? 'Header' : `Example ${index}`}
                          </TableCell>
                          <TableCell className="font-mono break-all">
                            {line}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="mt-2 text-sm text-gray-500">
                    Note: Ensure proper JSON formatting for options and use double quotes around JSON strings.
                  </p>
                </div>
              </Tab>
            ))}
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CSVImportModal;