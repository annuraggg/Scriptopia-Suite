import {
    Card,
    CardHeader,
    CardBody,
    Link,
} from "@nextui-org/react";
import { Clock, CodeXml, SquareStack } from "lucide-react";
import {
    AlignVerticalDistributeCenter,
    EarIcon,
    ClipboardListIcon,
    Scissors,
    ArrowLeftRight,
    Play,
} from "lucide-react"


const ViewUserAssessmentTop = () => {

    const Cards = [
        {
            title: "Time Taken",
            icon: Clock,
            value: "60 Minutes",
            color: "text-blue-500",
        },
        {
            title: "Code Completion",
            icon: CodeXml,
            value: "20%",
            color: "text-green-500",
        },
        {
            title: "MCQ Completion",
            icon: SquareStack,
            value: "70%",
            color: "text-yellow-500",
        },
    ];

    return (
        <div className='flex flex-col w-full h-[50%] gap-20'>
            <div className='w-full h-[25%] flex flex-row gap-6'>
                <Card className='w-[50%] h-32 flex flex-row justify-center items-center p-6'>
                    <CardBody className="flex justify-center items-start gap-1 flex-col">
                        <p className="text-3xl">Scriptopia Code</p>
                        <Link isExternal showAnchorIcon href="#" className="text-lg">contact@scriptopia.in</Link>
                    </CardBody>
                    <CardBody className="flex justify-center items-center gap-2 flex-row rounded-xl bg-gray-700 w-90%]">
                        <p className="textlg">Assesment Submitted On:</p>
                        <p className="text-sm text-green-500">20th August, 2021</p>
                    </CardBody>
                </Card>
                {Cards.map((card, index) => (
                    <Card key={index} className="h-32 w-56">
                        <CardHeader className="text-center flex justify-center text-gray-400">
                            {card.title}
                        </CardHeader>
                        <CardBody className="flex justify-center items-start gap-2 flex-row">
                            <card.icon size={30} className={`${card.color}`} />
                            <p className="text-xl">{card.value}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <div className='w-full h-screen flex flex-row gap-9'>
                <Card className="h-56 w-full">
                    <CardHeader className="text-center flex flex-row justify-center items-center text-gray-400 gap-2">
                        <AlignVerticalDistributeCenter className="text-white" size={26} />
                        <p className="text-xl">Total Average</p>
                    </CardHeader>
                    <CardBody className="flex justify-center items-start gap-1 flex-row pt-3 pl-5">
                        <div className="flex justify-center items-center pr-4 pl-1 gap-4 flex-col">
                            <p className="text-lg">Qualifying Score</p>
                            <p className="text-2xl text-blue-500">50%</p>
                        </div>
                        <div className="flex justify-center items-center gap-2 flex-col w-0.5 h-36 bg-gray-700"></div>
                        <div className="flex justify-center items-center pl-4 pr-8 gap-4 flex-col">
                            <p className="text-lg">John's Score</p>
                            <p className="text-2xl">50%</p>
                        </div>

                    </CardBody>
                </Card>
                <Card className="h-56 w-full">
                    <CardHeader className="text-center flex flex-row justify-center items-center text-gray-400 gap-2">
                        <EarIcon className="text-red-500" size={26} />
                        <p className="text-xl">Cheating</p>
                    </CardHeader>
                    <CardBody className="flex justify-start items-start gap-3 flex-col p-8">
                        <div className="flex justify-center items-center gap-3 flex-row">
                            <Scissors className="text-white" size={26} />
                            <p className="text-xl">Pasted Code</p>
                            <p className="text-lg text-green-500 ml-[90px]">NO</p>
                        </div>
                        <div className="flex justify-center items-center gap-3 flex-row">
                            <ArrowLeftRight className="text-white" size={26} />
                            <p className="text-xl">Window Switch</p>
                            <p className="text-lg text-green-500 ml-[68px]">NO</p>
                        </div>
                    </CardBody>
                </Card>
                <Card className="h-56 w-full">
                    <CardHeader className="text-center flex flex-row justify-center items-center text-gray-400 gap-2">
                        <ClipboardListIcon className="text-yellow-500" size={26} />
                        <p className="text-xl">Candidate's Status</p>
                    </CardHeader>
                    <CardBody className="flex justify-center items-center pb-16">
                        <p className="text-5xl text-green-500">Selected</p>
                    </CardBody>
                </Card>
                <Card className="h-56 w-full">
                    <CardHeader className="text-center flex flex-row justify-center items-center gap-2">
                        <p className="text-xl">Watch Session Rewind</p>
                    </CardHeader>
                    <CardBody className="flex justify-center items-center pb-16 pt-3">
                        <Link isBlock href="#" color="foreground">
                            <Play className="text-white" size={80} />
                        </Link>
                    </CardBody>
                </Card>
            </div>
        </div>

    )
}

export default ViewUserAssessmentTop