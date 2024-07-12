import { motion } from "framer-motion";
import {
    Card,
    CardHeader,
    CardBody,
} from "@nextui-org/react";

const ViewAssessment = () => {

    const cards = [
        {
            title: "Assessments",
            value: "20",
        },
        {
            title: "Assessed",
            value: "0",
            percentage: "0%",
        },
        {
            title: "Qualified",
            value: "0",
            percentage: "0%",
        },
    ]
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full p-10 h-screen flex flex-col gap-10"
        >
            <div className='flex flex-row justify-center items-center gap-10 w-full'>
                {cards.map((card, index) => (
                    <Card key={index} className="h-36 w-full">
                        <CardHeader className="text-center flex justify-center text-gray-400 pb-0 pt-11">
                            <p className='text-2xl'>{card.value}</p>
                        </CardHeader>
                        <CardBody className="flex justify-center items-center gap-2 flex-row pt-0 pb-8">
                            <p className="text-lg">{card.title}</p>
                            <p className="text-lg">{card.percentage}</p>
                        </CardBody>
                    </Card>
                ))}
                <Card className="h-36 w-full p-2">
                        <CardHeader className=" flex justify-start items-start pb-1 pt-1">
                        <p className="text-xl">Cheating</p>
                        </CardHeader>
                        <CardBody className="flex justify-center items-start gap-2 flex-col">
                            <p className="text-xs text-green-500">No Copying:</p>
                            <p className="text-xs text-yellow-500">Light Copying:</p>
                            <p className="text-xs text-red-500">Heavy Copying:</p>
                        </CardBody>
                    </Card>
            </div>
            <div className='w-full h-screen'>

            </div>

        </motion.div>
    )
}

export default ViewAssessment