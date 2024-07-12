import React from 'react'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Link,
} from "@nextui-org/react";
import {
    LinkedinIcon,
    TwitterIcon,
    GithubIcon,
    MapPin,
    Briefcase,
    Contact,
    Download,
} from "lucide-react";


const LeftPane = () => {
    return (
        <div className='w-[25%] h-screen flex flex-col gap-2'>
            <Card className="h-40 w-full rounded-xl">
                <CardHeader className="text-center flex flex-row gap-2 justify-center text-gray-400">
                    <p>Profile</p>
                </CardHeader>
                <CardBody className="flex justify-center items-start gap-5 flex-row">
                    <p className="text-xl">Username</p>
                    <p className="text-xl">Email</p>
                </CardBody>
            </Card>
            <Card className="h-12 w-full rounded-xl bg-gray-600">
                <CardBody className='flex flex-row justify-center items-between gap-4'>
                    <Link><GithubIcon size={24} /></Link>
                    <Link><LinkedinIcon size={24} /></Link>
                    <Link><TwitterIcon size={24} /></Link>
                </CardBody>
            </Card>
            <Card className="h-[45%] w-full rounded-xl">
                <CardBody className='flex flex-col justify-center items-start gap-10 p-5'>
                    <div className='flex flex-col justify-start items-start'>
                        <div className='flex flex-row justify-center items-center gap-1'>
                            <MapPin size={18} />
                            <p className="text-lg text-gray-400">Location</p>
                        </div>
                        <p className="text-xl ml-5">Mumbai, India</p>
                    </div>
                    <div className='flex flex-col justify-start items-start'>
                        <div className='flex flex-row justify-center items-center gap-1'>
                            <Contact size={18} />
                            <p className="text-lg text-gray-400">Contact</p>
                        </div>
                        <Link isExternal showAnchorIcon href="#" className="text-xl ml-5">contact@scriptopia.in</Link>
                    </div>
                    <div className='flex flex-col justify-start items-start'>
                        <div className='flex flex-row justify-center items-center gap-1'>
                            <Briefcase size={18} />
                            <p className="text-lg text-gray-400">Experience</p>
                        </div>
                        <p className="text-xl ml-5">3 Years, 8 Months</p>
                    </div>
                </CardBody>
            </Card>
            <Card className="h-12 w-full rounded-xl bg-gray-600">
                <CardBody className='flex flex-row justify-start items-center gap-36'>
                    <p className='text-lg'>Resume</p>
                    <Button color="default" endContent={<Download size={17}/>} size='sm' className=' h-8 text-sm justify-center items-center shadow-lg'>
                        Get it
                    </Button>
                </CardBody>
            </Card>
            <Button variant='bordered' className='h-12 w-full rounded-xl'>
                <Link href="/edit-profile">
                    <p className='text-lg'>Edit Profile</p>
                </Link>
            </Button>
        </div>
    )
}

export default LeftPane