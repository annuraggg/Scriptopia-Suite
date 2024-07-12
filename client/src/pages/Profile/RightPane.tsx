
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
    Link,
} from "@nextui-org/react";

const RightPane = () => {

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
        <div className='w-full h-screen flex flex-col gap-10'>
            <div className='flex flex-row gap-12'>
                <Card className='w-full h-[40vh] rounded-2xl'>
                    <CardHeader className="text-center flex flex-row gap-2 justify-center h-14 border-b-1 border-gray-400">
                        <Link isExternal showAnchorIcon href="/problems#" className="text-lg ml-5">Total Problems Solved</Link>
                    </CardHeader>
                    <CardBody className="flex justify-center items-center">
                    </CardBody>
                </Card>
                <Card className='w-full h-[40vh] rounded-2xl'>
                    <CardHeader className="text-center flex flex-row gap-2 justify-center h-14 border-b-1 border-gray-400">
                        <p className='text-lg'>Average Assessment Score:</p>
                        <p>70%</p>
                    </CardHeader>
                    <CardBody className="flex justify-center items-center">
                    </CardBody>
                </Card>
            </div>
            <div>
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
                        <Table isStriped aria-label="Code Results" className="pt-6">
                            <TableHeader>
                                <TableColumn className="text-sm">#</TableColumn>
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

export default RightPane