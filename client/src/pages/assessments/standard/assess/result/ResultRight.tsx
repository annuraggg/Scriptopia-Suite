import React, { Key, useState } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
}
    from "@nextui-org/react";

type ProgressOption = 'Coding' | 'MCQ';

const resultBar = () => {

    const [selectedOption, setSelectedOption] = useState<ProgressOption>('Coding');

    const handleSelectionChange = (key: Key) => {
        if (typeof key === 'string' && (key === 'Coding' || key === 'MCQ')) {
            setSelectedOption(key);
        }
    };

    return (
        <div>
            <Card className="h-[50vh] w-[50vh] pt-2 rounded-2xl">
                <CardHeader className="text-center flex flex-row gap-4 justify-center text-gray-400">
                    <p className="text-yellow-500">Your Progress</p>
                    <Dropdown className='w-12 h-12'>
                        <DropdownTrigger>
                            <Button variant="flat" className='w-11 h-9'>{selectedOption}</Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Link Actions"
                            onAction={handleSelectionChange}
                        >
                            <DropdownItem key="Coding">
                                Coding
                            </DropdownItem>
                            <DropdownItem key="MCQ">
                                MCQ
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>
                <CardBody className="flex justify-center items-start gap-3 flex-row">
                    {selectedOption === 'Coding' ? (
                        <div>Coding progress content goes here</div>
                    ) : (
                        <div>MCQ progress content goes here</div>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default resultBar;
