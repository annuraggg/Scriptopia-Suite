import React, { useState, useMemo } from 'react';
import { Calendar as LucideCalendar, MapPin, Users, Building2, Clock, Link as LinkIcon } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge, Tabs, Tab, Avatar, Tooltip, Progress, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

interface Interview {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    interviewer: Interviewer;
    status: InterviewStatus;
    meetingLink: string;
    company: CompanyInfo;
    position: string;
    round: number;
    totalRounds: number;
    preparationMaterials?: string[];
    location: string;
    type: 'technical' | 'behavioral' | 'system-design' | 'cultural-fit';
}

interface Interviewer {
    id: number;
    name: string;
    role: string;
    avatarUrl: string;
    company: string;
}

interface CompanyInfo {
    name: string;
    logo: string;
    department: string;
}

type InterviewStatus = 'scheduled' | 'completed' | 'rescheduled' | 'cancelled' | 'in-progress';
type TabKey = 'calendar' | 'upcoming' | 'completed' | 'analytics';
// type ViewMode = 'calendar' | 'list';


const sampleInterviews: Interview[] = [
    {
        id: 1,
        title: "Senior Frontend Developer Interview",
        startDate: new Date(2024, 11, 22, 10, 0),
        endDate: new Date(2024, 11, 22, 11, 30),
        interviewer: {
            id: 1,
            name: "John Smith",
            role: "Engineering Manager",
            avatarUrl: "/api/placeholder/32/32",
            company: "Tech Corp"
        },
        status: "scheduled",
        meetingLink: "https://meet.google.com/xyz",
        company: {
            name: "Tech Corp",
            logo: "/api/placeholder/40/40",
            department: "Frontend Engineering"
        },
        position: "Senior Frontend Developer",
        round: 2,
        totalRounds: 4,
        location: "Remote",
        type: "technical",
        preparationMaterials: [
            "JavaScript fundamentals",
            "React ecosystem",
            "System design basics"
        ]
    },
];

const InterviewCalendar: React.FC<{ interviews: Interview[] }> = ({ interviews }) => {
    const events = useMemo(() =>
        interviews.map(interview => ({
            id: interview.id.toString(),
            title: `${interview.company.name} - ${interview.title}`,
            start: interview.startDate,
            end: interview.endDate,
            backgroundColor: getStatusColor(interview.status),
            extendedProps: {
                interview: interview
            }
        })), [interviews]
    );

    const handleEventClick = (info: any) => {
        const interview = info.event.extendedProps.interview;
        console.log('Event clicked:', interview);
    };

    return (
        <div className="h-[800px] rounded-xl shadow-lg p-4">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                }}
                events={events}
                eventClick={handleEventClick}
                height="100%"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                expandRows={true}
                stickyHeaderDates={true}
                nowIndicator={true}
                eventDisplay="block"
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: 'short'
                }}
            />
        </div>
    );
};

const getStatusColor = (status: InterviewStatus): string => {
    const colors = {
        'scheduled': '#3B82F6',
        'completed': '#10B981',
        'rescheduled': '#F59E0B',
        'cancelled': '#EF4444',
        'in-progress': '#8B5CF6'
    };
    return colors[status] || '#6B7280';
};


const InterviewCard: React.FC<{ interview: Interview }> = ({ interview }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <Card className="w-full mb-4 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4"
                style={{ borderLeftColor: getStatusColor(interview.status) }}>
                <CardHeader className="flex justify-between items-start p-4">
                    <div className="flex items-start space-x-4">
                        <Avatar src={interview.company.logo} size="lg" />
                        <div>
                            <h3 className="text-xl font-bold">{interview.title}</h3>
                            <div className="flex items-center mt-1">
                                <Building2 className="w-4 h-4 mr-1 text-gray-500" />
                                <span className="text-gray-600">{interview.company.name}</span>
                            </div>
                        </div>
                    </div>
                    <Badge
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(interview.status) }}
                    >
                        {interview.status}
                    </Badge>
                </CardHeader>

                <CardBody className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{interview.startDate.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{interview.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <Tooltip content={interview.interviewer.role}>
                                    <div className="flex items-center">
                                        <Avatar src={interview.interviewer.avatarUrl} size="sm" className="mr-2" />
                                        <span>{interview.interviewer.name}</span>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Interview Progress</p>
                                <Progress
                                    value={(interview.round / interview.totalRounds) * 100}
                                    className="w-full"
                                    color="primary"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Round {interview.round} of {interview.totalRounds}
                                </p>
                            </div>

                            <div className="flex items-center">
                                <LinkIcon className="w-4 h-4 mr-2 text-gray-500" />
                                <a
                                    href={interview.meetingLink}
                                    className="text-blue-500 hover:text-blue-600 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Join Meeting
                                </a>
                            </div>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="flex justify-between items-center p-4">
                    <div className="flex space-x-2">
                        {interview.preparationMaterials?.map((material, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800">
                                {material}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            color="warning"
                            variant="flat"
                            size="sm"
                        >
                            Reschedule
                        </Button>
                        <Button
                            color="primary"
                            variant="solid"
                            size="sm"
                        >
                            Prepare
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const Interviews: React.FC = () => {
    const [interviews] = useState<Interview[]>(sampleInterviews);
    const [selectedTab, setSelectedTab] = useState<TabKey>('calendar');

    return (
        <div className="min-h-screen p-6">
            <Breadcrumbs>
                <BreadcrumbItem href="/profile">Jobs</BreadcrumbItem>
                <BreadcrumbItem href="/profile">Interviews</BreadcrumbItem>
            </Breadcrumbs>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 pt-4"
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">Interview Schedule</h1>
                    <Button
                        color="primary"
                        className="font-semibold"
                    >
                        Schedule New Interview
                    </Button>
                </div>

                <Tabs
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as TabKey)}
                    className="mb-6"
                    size="lg"
                >
                    <Tab
                        key="calendar"
                        title={
                            <div className="flex items-center space-x-2">
                                <LucideCalendar size={18} />
                                <span>Calendar View</span>
                            </div>
                        }
                    />
                    <Tab key="upcoming" title="Upcoming Interviews" />
                    <Tab key="completed" title="Past Interviews" />
                    <Tab key="analytics" title="Analytics" />
                </Tabs>
            </motion.div>

            <AnimatePresence mode="wait">
                {selectedTab === "calendar" ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <InterviewCalendar interviews={interviews} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {interviews.map(interview => (
                            <InterviewCard
                                key={interview.id}
                                interview={interview}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Interviews;