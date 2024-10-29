import React, { useState } from "react";
import { Card, CardHeader, Button } from "@nextui-org/react";
import { Plus, Upload } from "lucide-react";
import { motion } from "framer-motion";
import QuestionModal from "./AddQuestionModal";
import QuestionList from "./QuestionList";
import { Question, McqContentProps } from "../../../../../../../types/mcq.types";

interface SectionQuestions {
    [sectionId: number]: Question[];
}

const McqContent: React.FC<McqContentProps> = ({ selectedSection }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [sectionQuestions, setSectionQuestions] = useState<SectionQuestions>({});
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const currentQuestions = selectedSection 
        ? sectionQuestions[selectedSection.id] || []
        : [];

    const handleAddQuestion = (newQuestion: Question) => {
        if (!selectedSection) return;

        if (editingQuestion) {
            setSectionQuestions(prev => ({
                ...prev,
                [selectedSection.id]: prev[selectedSection.id].map(q =>
                    q.id === editingQuestion.id ? newQuestion : q
                )
            }));
            setEditingQuestion(null);
        } else {
            setSectionQuestions(prev => ({
                ...prev,
                [selectedSection.id]: [
                    ...(prev[selectedSection.id] || []),
                    newQuestion
                ]
            }));
        }
        setModalOpen(false);
    };

    const handleMoveUp = (id: number) => {
        if (!selectedSection) return;

        const questions = currentQuestions;
        const index = questions.findIndex(q => q.id === id);
        if (index > 0) {
            const newQuestions = [...questions];
            [newQuestions[index - 1], newQuestions[index]] =
                [newQuestions[index], newQuestions[index - 1]];
            setSectionQuestions(prev => ({
                ...prev,
                [selectedSection.id]: newQuestions
            }));
        }
    };

    const handleMoveDown = (id: number) => {
        if (!selectedSection) return;

        const questions = currentQuestions;
        const index = questions.findIndex(q => q.id === id);
        if (index < questions.length - 1) {
            const newQuestions = [...questions];
            [newQuestions[index], newQuestions[index + 1]] =
                [newQuestions[index + 1], newQuestions[index]];
            setSectionQuestions(prev => ({
                ...prev,
                [selectedSection.id]: newQuestions
            }));
        }
    };

    const handleEdit = (id: number) => {
        if (!selectedSection) return;

        const question = currentQuestions.find(q => q.id === id);
        if (question) {
            setEditingQuestion(question);
            setModalOpen(true);
        }
    };

    const handleDelete = (id: number) => {
        if (!selectedSection) return;

        setSectionQuestions(prev => ({
            ...prev,
            [selectedSection.id]: prev[selectedSection.id].filter(q => q.id !== id)
        }));
    };

    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedSection) return;

        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n');

                const newQuestions = rows.slice(1).map((row, index) => {
                    const values = row.split(',');
                    return {
                        id: Date.now() + index,
                        type: values[0] as Question["type"],
                        text: values[1],
                        options: values[2] ? JSON.parse(values[2]) : undefined,
                    };
                });

                setSectionQuestions(prev => ({
                    ...prev,
                    [selectedSection.id]: [
                        ...(prev[selectedSection.id] || []),
                        ...newQuestions
                    ]
                }));
            };
            reader.readAsText(file);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[80%]"
        >
            <Card className="h-full rounded-xl">
                {selectedSection ? (
                    <div className="p-1">
                        <CardHeader className="flex flex-row items-center justify-between px-2">
                            <div>
                                <h2 className="text-xl font-semibold">{selectedSection.name}</h2>
                                <p className="text-sm text-gray-500">
                                    Setup MCQ questions for {selectedSection.name}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleImportCSV}
                                        className="hidden"
                                        id="csv-upload"
                                    />
                                    <Button
                                        as="label"
                                        htmlFor="csv-upload"
                                        startContent={<Upload size={16} />}
                                        variant="bordered"
                                    >
                                        Import CSV
                                    </Button>
                                </div>
                                <Button
                                    startContent={<Plus size={16} />}
                                    color="primary"
                                    onClick={() => {
                                        setEditingQuestion(null);
                                        setModalOpen(true);
                                    }}
                                >
                                    Add Question
                                </Button>
                            </div>
                        </CardHeader>

                        <div className="flex-grow overflow-auto px-2">
                            <div className="h-full overflow-auto">
                                {currentQuestions.length > 0 ? (
                                    <QuestionList
                                        questions={currentQuestions}
                                        onMoveUp={handleMoveUp}
                                        onMoveDown={handleMoveDown}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">
                                            No questions added yet. Click "Add Question" to get started.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">Select a section to view its content</p>
                    </div>
                )}
            </Card>

            <QuestionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingQuestion(null);
                }}
                onAddQuestion={handleAddQuestion}
                editingQuestion={editingQuestion}
            />
        </motion.div>
    );
};

export default McqContent;