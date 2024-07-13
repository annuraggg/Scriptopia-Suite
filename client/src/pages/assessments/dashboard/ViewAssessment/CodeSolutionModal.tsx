import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Card, 
    CardBody, 
    Link,
    CardHeader,
    Accordion,
    AccordionItem,
    Table,
    TableColumn,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
} from "@nextui-org/react";
import {
    ClipboardListIcon,
    Clock,
}
from "lucide-react";

interface CodeSolutionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CodeSolutionModal: React.FC<CodeSolutionModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size='full' className='p-4'>
            <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-2">Coding Result</ModalHeader>
                        <ModalBody className='p-20'>
                            <div className='w-full h-full flex flex-row gap-4'>
                                <Card className='w-[45%] h-20 flex flex-row justify-center items-center p-2'>
                                    <CardBody className="flex justify-center items-start gap-1 flex-col">
                                        <p className="text-xl">Scriptopia Code</p>
                                        <Link isExternal showAnchorIcon href="#" className="text-sm">contact@scriptopia.in</Link>
                                    </CardBody>
                                    <CardBody className="flex justify-center items-center gap-2 flex-row rounded-xl bg-gray-700 w-[90%]">
                                        <p className="text-base">Code Result</p>
                                    </CardBody>
                                </Card>
                                <Card className='w-[55%] h-20 flex flex-row justify-center items-center p-2'>
                                    <CardBody className="flex justify-center items-start gap-1 flex-col">
                                        <p className="text-xl">Two Sum</p>
                                    </CardBody>
                                    <CardBody className="flex justify-center items-center gap-2 flex-row rounded-xl bg-blue-800 w-[40vh]">
                                        <Link showAnchorIcon className="text-base">View Question</Link>
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
                                <Card className='w-full h-16 flex flex-row justify-start items-start p-2 gap-3'>
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
                            <div className=' flex flex-row'>
                                <Accordion variant="splitted" className='w-full h-full'>
                                    <AccordionItem value="1" className='' aria-label="Accordion 1" title="TestCases">
                                        <Table isStriped aria-label="Mcq Results" className="pt-6">
                                            <TableHeader>
                                                <TableColumn className="text-sm">Input</TableColumn>
                                                <TableColumn className="text-sm">Expected Output</TableColumn>
                                                <TableColumn className="text-sm">User Output</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                    <TableRow className="h-14">
                                                        <TableCell className="w-full md:w-auto">["H","a","n","n","a","h"]</TableCell>
                                                        <TableCell className="w-full md:w-auto">["h","a","n","n","a","H"]</TableCell>
                                                        <TableCell className="w-full md:w-auto">["h","a","n","n","a","H"]</TableCell>
                                                    </TableRow>
                                            </TableBody>
                                        </Table>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <div className='w-full h-full flex flex-col'>
                                <Card className='w-full h-30 flex flex-col justify- items-center'>

                                </Card>
                            </div>
                        </ModalBody>
                    </>
            </ModalContent>
        </Modal>
    );
};

export default CodeSolutionModal;