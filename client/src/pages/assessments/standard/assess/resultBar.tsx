import React from 'react'
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Button, 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem } 
from "@nextui-org/react";
 const resultBar = () => {
    return (
        <div>
            <Card className="h-72 w-96 pt-2 rounded-2xl">
                <CardHeader className="text-center flex flex-row gap-4 justify-center text-gray-400">
                    <p className="text-yellow-500">Your Progress</p>
                    <Dropdown className='w-12 h-12'>
                        <DropdownTrigger>
                            <Button variant="flat" className='w-11 h-9'>Select</Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Link Actions">
                            <DropdownItem key="home" href="/home">
                                Coding
                            </DropdownItem>
                            <DropdownItem key="about" href="/about">
                                MCQ
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>
                <CardBody className="flex justify-center items-start gap-3 flex-row"></CardBody>
            </Card>
        </div>
    )
}

export default resultBar;
