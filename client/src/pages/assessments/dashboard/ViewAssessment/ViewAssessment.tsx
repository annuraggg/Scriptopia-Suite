import { motion } from "framer-motion";
import {
    Card,
    CardHeader,
    CardBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';

const ViewAssessment = () => {
    const navigate = useNavigate();

    const UserTable = [
        {
            name: "John Doe",
            email: "johndoe@gmail.com",
            status: "Completed",
            date: "Fri Jul 12 2024",
            timeTaken: {
                min: "10m",
                sec: "32s",
            },
            score: "20",
            cheating: "No Copying",
        },
        {
            name: "John Doe",
            email: "johndoe@gmail.com",
            status: "Completed",
            date: "Fri Jul 12 2024",
            timeTaken: {
                min: "10m",
                sec: "32s",
            },
            score: "20",
            cheating: "Light Copying",
        },
        {
            name: "John Doe",
            email: "johndoe@gmail.com",
            status: "Completed",
            date: "Fri Jul 12 2024",
            timeTaken: {
                min: "10m",
                sec: "32s",
            },
            score: "20",
            cheating: "Heavy Copying",
        },
    ]

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
            className="w-full p-10 h-screen flex flex-col gap-8"
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
                <Table isStriped aria-label="Code Results" className="pt-10">
                    <TableHeader>
                        <TableColumn className="text-sm">Name</TableColumn>
                        <TableColumn className="text-sm">Email</TableColumn>
                        <TableColumn className="text-sm">Status</TableColumn>
                        <TableColumn className="text-sm">Date</TableColumn>
                        <TableColumn className="text-sm">Time Taken</TableColumn>
                        <TableColumn className="text-sm">Score</TableColumn>
                        <TableColumn className="text-sm">Cheating</TableColumn>
                        <TableColumn className="text-sm">Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {UserTable.map((userTable: any) => (
                            <TableRow className="h-14" key={userTable.questionNo}>
                                <TableCell className="w-full md:w-auto">{userTable.name}</TableCell>
                                <TableCell className="w-full md:w-auto">{userTable.email}</TableCell>
                                <TableCell className="w-full md:w-auto">{userTable.status}</TableCell>
                                <TableCell className="w-full md:w-auto">{userTable.date}</TableCell>
                                <TableCell className="w-full md:w-auto">{userTable.timeTaken.min}m {userTable.timeTaken.sec}s</TableCell>
                                <TableCell className="w-full md:w-auto">{userTable.score}</TableCell>
                                <TableCell className="w-full md:w-auto">{userTable.cheating}</TableCell>
                                <TableCell className="w-full md:w-auto">
                                    <Button variant="light" className="text-green-500" onClick={() => navigate(`/assessments/id/view/id`)}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    )
}

export default ViewAssessment