import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
} from "@nextui-org/react";
import { UsersRound, BookUser, Percent } from "lucide-react";


const ViewUserAssessmentTop = () => {

    const Cards = [
        {
          title: "Total Students",
          icon: UsersRound,
          value: 20,
          color: "text-blue-500",
        },
        {
          title: "Total Problems",
          icon: BookUser,
          value: 20,
          color: "text-red-500",
        },
        {
          title: "Acceptance Rate",
          icon: Percent,
          value: 70,
          color: "text-green-500",
        },
      ];

    return (
        <div className='flex flex-col w-full h-screen'>
            <div className='w-full h-screen flex flex-row gap-7'>
                <Card className='w-[50%] h-32'>
                    <CardBody className="flex justify-center items-start gap-5 flex-row">
                        <p className="text-xl"></p>
                    </CardBody>
                </Card>
                {Cards.map((card, index) => (
                    <Card key={index} className="h-32 w-56">
                        <CardHeader className="text-center flex justify-center text-gray-400">
                            {card.title}
                        </CardHeader>
                        <CardBody className="flex justify-center items-start gap-5 flex-row">
                            <card.icon size={30} className={`${card.color}`} />
                            <p className="text-xl">{card.value}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <div className='w-full h-screen'>

            </div>
        </div>

    )
}

export default ViewUserAssessmentTop