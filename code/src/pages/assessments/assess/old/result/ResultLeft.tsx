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
    Tabs,
    Tab,
} from "@nextui-org/react";
import { Clock4, Code, SquareStack } from "lucide-react";



const ResultLeft = () => {

    const codeResult = [
        {
            questionNo: 1,
            title: "Two Sum",
            timeTaken: "10m:32s",
            score: "18 out off 20",
        },
        {
            questionNo: 2,
            title: "Add Two Numbers",
            timeTaken: "10m:32s",
            score: "18 out off 20",
        },
        {
            questionNo: 3,
            title: "Longest Substring Without Repeating Characters",
            timeTaken: "10m:32s",
            score: "18 out off 20",
        },
        {
            questionNo: 4,
            title: "Median of Two Sorted Arrays",
            timeTaken: "10m:32s",
            score: "18 out off 20",
        },
        {
            questionNo: 5,
            title: "Longest Palindromic Substring",
            timeTaken: "10m:32s",
            score: "18 out off 20",
        },
    ]

    const mcqResult = [
        {
            questionNo: 1,
            test: "test 01",
            correct: "54",
            incorrect: "07",
            totalScore: "60",
            yourScore: "60",
            percentage: "100",
        },
        {
            questionNo: 2,
            test: "Text 02",
            correct: "54",
            incorrect: "07",
            totalScore: "60",
            yourScore: "60",
            percentage: "100",
        },
        {
            questionNo: 3,
            test: "Text 03",
            correct: "54",
            incorrect: "07",
            totalScore: "60",
            yourScore: "60",
            percentage: "100",
        },
        {
            questionNo: 4,
            test: "Text 04",
            correct: "54",
            incorrect: "07",
            totalScore: "60",
            yourScore: "60",
            percentage: "100",
        },
        {
            questionNo: 5,
            test: "Text 05",
            correct: "54",
            incorrect: "07",
            totalScore: "60",
            yourScore: "60",
            percentage: "100",
        },
    ]

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="flex justify-center gap-11 w-full">
                <Card className="h-36 w-full">
                    <CardHeader className="flex flex-row gap-2 text-center justify-center text-gray-400">
                        <p>Time Taken</p>
                        <Clock4 size={28} className="text-blue-500" />
                    </CardHeader>
                    <CardBody className="flex justify-center items-start gap-5 flex-row">
                        <p className="text-xl"></p>
                    </CardBody>
                </Card>
                <Card className="h-36 w-full">
                    <CardHeader className="text-center flex flex-row gap-2 justify-center text-gray-400">
                        <p>Coding Completion</p>
                        <Code size={28} className="text-green-500" />
                    </CardHeader>
                    <CardBody className="flex justify-center items-start gap-5 flex-row">
                        <p className="text-xl"></p>
                    </CardBody>
                </Card>
                <Card className="h-36 w-full">
                    <CardHeader className="text-center flex flex-row gap-2 justify-center text-gray-400">
                        <p>MCQ Completion</p>
                        <SquareStack size={27} className="text-yellow-500" />
                    </CardHeader>
                    <CardBody className="flex justify-center items-start gap-5 flex-row">
                        <p className="text-xl"></p>
                    </CardBody>
                </Card>
            </div>
            <div>
                <div className="flex flex-row justify-center items-center pt-7 gap-9 w-full">
                    <Card className="h-44 w-full">
                        <CardHeader className="text-left flex flex-row gap-2 justify-start text-gray-400 border-b-2">
                            <p>Assessments Results:</p>
                        </CardHeader>
                        <CardBody className="flex justify-center items-center gap-3 flex-col p-2">
                            <p className="text-sm">🌟 Congratulations on completing the assessment! 🌟</p>
                            <p className="text-sm">Based on your performance, here's your skill level:</p>
                            <p className="text-sm text-blue-500">Intermediate.🚀</p>
                        </CardBody>
                    </Card>
                    <Card className="h-44 w-full">
                        <CardHeader className="text-center flex flex-row gap-2 justify-center text-gray-400">
                            <p>Your Report Card</p>
                        </CardHeader>
                        <CardBody className="flex justify-center items-start gap-5 flex-row">
                            <ul className="list-disc ml-4 text-sm flex flex-col gap-3">
                                <li><span className='text-blue-500 mr-1'>Time Taken:</span>10 mins</li>
                                <li><span className='text-green-500 mr-1'>Coding Completion:</span>10 mins</li>
                                <li><span className='text-yellow-500 mr-1'>MCQ Completion:</span>10 mins</li>
                            </ul>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className='w-full pt-7'>
                <Tabs aria-label="Options" className=''>
                    <Tab key="mcq" title="MCQs" className="">
                    <Table isStriped aria-label="Mcq Results" className="pt-6">
                            <TableHeader>
                                <TableColumn className="text-sm">#</TableColumn>
                                <TableColumn className="text-sm">Test</TableColumn>
                                <TableColumn className="text-sm">Correct</TableColumn>
                                <TableColumn className="text-sm">Incorrect</TableColumn>
                                <TableColumn className="text-sm">Total Score</TableColumn>
                                <TableColumn className="text-sm">Your Score</TableColumn>
                                <TableColumn className="text-sm">Percentage</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {mcqResult.map((mcqResult: any) => (
                                    <TableRow className="h-14" key={mcqResult.questionNo}>
                                        <TableCell className="w-full md:w-auto">{mcqResult.questionNo}</TableCell>
                                        <TableCell className="w-full md:w-auto">{mcqResult.test}</TableCell>
                                        <TableCell className="w-full md:w-auto">{mcqResult.correct}</TableCell>
                                        <TableCell className="w-full md:w-auto">{mcqResult.incorrect}</TableCell>
                                        <TableCell className="w-full md:w-auto">{mcqResult.totalScore}</TableCell>
                                        <TableCell className="w-full md:w-auto">{mcqResult.yourScore}</TableCell>
                                        <TableCell className="w-full md:w-auto">{mcqResult.percentage}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Tab>
                    <Tab key="coding" title="Coding" className="">
                        <Table isStriped aria-label="Code Results" className="pt-10">
                            <TableHeader>
                                <TableColumn className="text-sm">Question No.</TableColumn>
                                <TableColumn className="text-sm">Question</TableColumn>
                                <TableColumn className="text-sm">Time Taken</TableColumn>
                                <TableColumn className="text-sm">Score</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {codeResult.map((codeResult: any) => (
                                    <TableRow className="h-14" key={codeResult.questionNo}>
                                        <TableCell className="w-full md:w-auto">{codeResult.questionNo}</TableCell>
                                        <TableCell className="w-full md:w-auto">{codeResult.title}</TableCell>
                                        <TableCell className="w-full md:w-auto">{codeResult.timeTaken}</TableCell>
                                        <TableCell className="w-full md:w-auto">{codeResult.score}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default ResultLeft