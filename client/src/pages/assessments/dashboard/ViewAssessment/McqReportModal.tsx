import React from 'react';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Card,
    CardBody,
    Link,
    CardHeader,
    Button,
    Textarea,
} from "@nextui-org/react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    ClipboardListIcon,
    Clock,
    CompassIcon,
    TriangleAlert,
}
from "lucide-react";

interface McqReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const McqReportModal: React.FC<McqReportModalProps> = ({ isOpen, onClose }) => {

    const [isOpenSheet, setIsOpenSheet] = useState(false);

    const mcqs = [
        {
            question: "What is the capital of France?",
            type: "multiple",
            options: ["Paris", "Berlin", "London", "Madrid"],
        },
        {
            question: "Who is CEO of Tesla?",
            type: "checkbox",
            options: ["Jeff Bezos", "Elon Musk", "Bill Gates", "Tony Stark"],
        },
        {
            question: "The iPhone was created by which company?",
            type: "text",
        },
    ];

    const goTo = (id: string) => {
        const item = document.getElementById(id);
        if (item) {
            item.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
            });
        }

        setIsOpenSheet(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='full'>
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-2 p-6">MCQ Result</ModalHeader>
                    <ModalBody className='p-32 overflow-y-auto'>
                        <div className='w-full h-full flex flex-row gap-4'>
                            <Card className='w-[45%] h-20 flex flex-row justify-center items-center p-2'>
                                <CardBody className="flex justify-center items-start gap-1 flex-col">
                                    <p className="text-xl">Scriptopia Code</p>
                                    <Link isExternal showAnchorIcon href="#" className="text-sm">contact@scriptopia.in</Link>
                                </CardBody>
                                <CardBody className="flex justify-center items-center gap-2 flex-row rounded-xl bg-gray-700 w-[90%]">
                                    <p className="text-base">MCQ Result</p>
                                </CardBody>
                            </Card>
                            <Card className='w-[55%] h-20 flex flex-row justify-center items-center p-2'>
                                <CardBody className="flex justify-center items-start gap-1 flex-col">
                                    <p className="text-xl">Assesment Name</p>
                                </CardBody>
                                <CardBody className="flex justify-center items-center gap-2 flex-row rounded-xl bg-blue-800 w-[40vh]">
                                    <Link showAnchorIcon className="text-base">Go to Assesment</Link>
                                </CardBody>
                            </Card>
                        </div>
                        <div className='w-full h-full flex flex-row gap-4'>
                            <Card className='w-[40%] h-28'>
                                <CardHeader className='flex flex-row justify-center items-center pb-0 text-gray-500'>
                                    <p>Time Taken</p>
                                </CardHeader>
                                <CardBody className='flex flex-row justify-center items-center gap-3'>
                                    <Clock size={28} className='text-blue-500' />
                                    <p>150s</p>
                                </CardBody>
                            </Card>
                            <Card className='w-[40%] h-28'>
                                <CardHeader className='flex flex-row justify-center items-center pb-0 text-gray-500'>
                                    <p>Code Solution</p>
                                </CardHeader>
                                <CardBody className='flex flex-row justify-center items-center gap-3'>
                                    <ClipboardListIcon size={28} className='text-green-500' />
                                    <p>Accepted</p>
                                </CardBody>
                            </Card>
                            <Card className='w-[60%] h-28'>
                                <CardHeader className='flex flex-row justify-center items-center pb-0 text-gray-500'>
                                    <p>Programming Language Used</p>
                                </CardHeader>
                                <CardBody className='flex flex-row justify-center items-center gap-3'>
                                    <p>JavaScript</p>
                                </CardBody>
                            </Card>
                        </div>
                        <div className='w-full h-full flex flex-row'>
                            <Card className='w-full h-18 flex flex-row justify-start items-start p-4 gap-3'>
                                <CardBody className="flex justify-center items-startr gap-2 flex-row rounded-3xl bg-green-600 w-[40vh] border-2px">
                                    <p className="text-base">No Cheating Deteted</p>
                                </CardBody>
                                <CardBody className="flex justify-center items-center gap-2 flex-row rounded-3xl bg-gray-700 w-[40vh] border-2px">
                                    <p className="text-base">Pasted 0 Time(s)</p>
                                </CardBody>
                                <CardBody className="flex justify-center items-center gap-2 flex-row rounded-3xl bg-gray-700 w-[40vh] border-2px">
                                    <p className="text-base">Windows Switch 0 Time(s)</p>
                                </CardBody>
                            </Card>
                        </div>
                        <div className='w-full h-full flex flex-col'>
                            <div className='w-full h-full flex flex-row gap-3'>
                                <Card className='w-full h-full flex flex-row p-4 gap-3'>
                                    <Card className='w-full h-14 flex flex-row justify-center items-center'>
                                        <CardBody className="flex flex-row justify-start items-center gap-3 ml-3">
                                            <Button isIconOnly onClick={() => setIsOpenSheet(true)}>
                                                <CompassIcon />
                                            </Button>
                                            <p className="text-xl">Navigate</p>
                                        </CardBody>
                                    </Card>
                                    <Input type="Search" label="Search Problems" size="md" className='w-full h-20 flex flex-row justify-center items-start' />
                                </Card>
                            </div>
                            <div>
                                {mcqs.map((mcq, index) => (
                                    <div
                                        className="flex flex-col border p-5 mt-3 rounded-xl bg-gray-100 bg-opacity-5 min-h-[30vh]"
                                        id={`mcq-${index}`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <div>{mcq.question}</div>
                                            <div className="opacity-50">
                                                {index + 1} of {mcqs.length}
                                            </div>
                                        </div>

                                        {(mcq.type === "multiple" || mcq.type === "checkbox") && (
                                            <div>
                                                <p className="mt text-xs mt-3">
                                                    Select{" "}
                                                    {mcq.type === "checkbox" ? "one or more " : "one "}
                                                    option:
                                                </p>
                                                <ToggleGroup
                                                    type={mcq.type === "multiple" ? "single" : "multiple"}
                                                    className="w-full flex-wrap gap-3 mt-2"
                                                >
                                                    {mcq?.options?.map((option) => (
                                                        <ToggleGroupItem
                                                            key={option}
                                                            value={option}
                                                            className="w-[48%] data-[state=on]:bg-green-6 data-[state=on]:bg-green-600 data-[state=on]:bg-opacity-20 data-[state=on]:text-green-500 border-2 p-5 bg-gray-100 bg-opacity-10"
                                                        >
                                                            {option}
                                                        </ToggleGroupItem>
                                                    ))}
                                                </ToggleGroup>
                                                <div className='flex flex-row justify-center items-center gap-2 mt-3 ml-3 mr-3'>
                                                    <Card className='w-full h-11 p-1 rounded-xl'>
                                                        <CardBody className='flex flex-row gap-2 p-2 justify-center items-center'>
                                                            <p className="text-sm flex flex-row gap-2 justify-center items-center">Your Answer:<p className='text-blue-600'>A</p></p>
                                                        </CardBody>
                                                    </Card>
                                                    <Card className='w-full h-11 p-1 rounded-xl'>
                                                        <CardBody className='flex flex-row gap-2 p-2 justify-center items-center'>
                                                            <p className="text-sm flex flex-row gap-2 justify-center items-center">Correct Answer:<p>A</p></p>
                                                        </CardBody>
                                                    </Card>
                                                    <Card className='w-full h-11 p-1 rounded-xl'>
                                                        <CardBody className='flex flex-row gap-2 p-2 justify-center items-center'>
                                                            <p className="text-sm flex flex-row gap-2 justify-center items-center">Status:<p className='text-green-600'>Correct</p></p>
                                                        </CardBody>
                                                    </Card>
                                                    <Card className='w-full h-11 p-1 rounded-xl'>
                                                        <CardBody className='flex flex-row gap-2 p-2 justify-center items-center'>
                                                            <p className="text-sm flex flex-row gap-2 justify-center items-center">Score:<p className='text-blue-600'>1 Marks</p></p>
                                                        </CardBody>
                                                    </Card>
                                                    <Card className='w-full h-11 p-1 rounded-xl bg-red-500 bg-opacity-10'>
                                                        <CardBody className='flex flex-row gap-2 p-2 justify-center items-center'>
                                                            <p className="text-sm flex flex-row gap-2 justify-center items-center rounded-xl"><TriangleAlert size={16} className='text-red-500' />Report Solution</p>
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            </div>
                                        )}

                                        {mcq.type === "text" && (
                                            <div>
                                                <Textarea
                                                    variant="bordered"
                                                    type="text"
                                                    placeholder="Write your answer here"
                                                    className="w-full mt-5 rounded-xl bg-gray-100 bg-opacity-5 min-h-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
                                <SheetContent side="left">
                                    <SheetHeader>
                                        <SheetTitle>Questions</SheetTitle>
                                        <SheetDescription>
                                            {mcqs.map((mcq, index) => (
                                                <div>
                                                    <a
                                                        onClick={() => goTo(`mcq-${index}`)}
                                                        className="block p-4 border rounded-lg mt-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-10"
                                                    >
                                                        {index + 1}. {mcq.question}
                                                    </a>
                                                </div>
                                            ))}
                                        </SheetDescription>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
    );
};

export default McqReportModal;