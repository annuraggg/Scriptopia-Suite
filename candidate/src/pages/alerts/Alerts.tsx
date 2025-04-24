import { useState } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";
import { Bell, Clock, FileText, FormInput, Brain, Briefcase, Mail } from 'lucide-react';

const Alerts = () => {
  const [emailAlert, setEmailAlert] = useState('');
  const [selectedTime, setSelectedTime] = useState('15');

  const pendingDocs = [
    { id: 1, name: "Resume", status: "Missing" },
    { id: 2, name: "Academic Transcripts", status: "Missing" },
  ];

  const pendingForms = [
    { id: 1, name: "Student Information Form", deadline: "2024-12-25" },
    { id: 2, name: "Placement Preferences", deadline: "2024-12-30" },
  ];

  const pendingAssessments = [
    { id: 1, company: "TechCorp", role: "Software Engineer", deadline: "2024-12-22" },
    { id: 2, company: "DataCo", role: "Data Analyst", deadline: "2024-12-24" },
  ];

  const upcomingInterviews = [
    { 
      id: 1, 
      company: "InnovateX",
      role: "Frontend Developer",
      datetime: "2024-12-20T14:00:00",
      type: "Technical Round"
    },
    {
      id: 2,
      company: "CloudTech",
      role: "Full Stack Developer",
      datetime: "2024-12-21T11:00:00",
      type: "HR Round"
    }
  ];

  const jobDeadlines = [
    {
      id: 1,
      company: "WebSolutions",
      role: "UI Developer",
      deadline: "2024-12-23",
      applied: false
    },
    {
      id: 2,
      company: "MobileTech",
      role: "React Native Developer",
      deadline: "2024-12-24",
      applied: false
    }
  ];

  const handleSetAlert = (interviewId: number) => {
    console.log(`Alert set for ${selectedTime} minutes before interview ${interviewId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl space-y-6"
      >
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Bell className="w-8 h-8" />
          Alerts & Notifications
        </h1>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardHeader className="flex gap-3">
              <FileText className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-xl font-bold">Pending Documents</p>
                <p className="text-small text-default-500">Required documents for your profile</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {pendingDocs.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 rounded-lg">
                    <span>{doc.name}</span>
                    <Button color="primary" size="sm">Upload</Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardHeader className="flex gap-3">
              <FormInput className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-xl font-bold">Forms to Complete</p>
                <p className="text-small text-default-500">Required forms from your institution</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {pendingForms.map(form => (
                  <div key={form.id} className="flex justify-between items-center p-3 rounded-lg">
                    <div>
                      <span className="block">{form.name}</span>
                      <span className="text-sm text-gray-500">Due: {form.deadline}</span>
                    </div>
                    <Button color="primary" size="sm">Fill Form</Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardHeader className="flex gap-3">
              <Brain className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-xl font-bold">Pending Assessments</p>
                <p className="text-small text-default-500">Complete these assessments for your job applications</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {pendingAssessments.map(assessment => (
                  <div key={assessment.id} className="flex justify-between items-center p-3 rounded-lg">
                    <div>
                      <span className="block font-medium">{assessment.company}</span>
                      <span className="text-sm text-gray-500">{assessment.role}</span>
                      <span className="block text-sm text-gray-500">Deadline: {assessment.deadline}</span>
                    </div>
                    <Button color="primary" size="sm">Start Assessment</Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardHeader className="flex gap-3">
              <Briefcase className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-xl font-bold">Upcoming Interviews</p>
                <p className="text-small text-default-500">Schedule and set reminders for your interviews</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {upcomingInterviews.map(interview => (
                  <div key={interview.id} className="p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="block font-medium">{interview.company}</span>
                        <span className="text-sm text-gray-500">{interview.role}</span>
                        <span className="block text-sm text-gray-500">{interview.type}</span>
                        <span className="block text-sm font-medium mt-1">
                          {new Date(interview.datetime).toLocaleString()}
                        </span>
                      </div>
                      <Button color="secondary" size="sm">Join Meeting</Button>
                    </div>
                    <div className="flex gap-3 items-center mt-2">
                      <Input
                        type="email"
                        placeholder="Enter email for reminder"
                        value={emailAlert}
                        onChange={(e) => setEmailAlert(e.target.value)}
                        className="max-w-xs"
                        endContent={<Mail className="w-4 h-4" />}
                      />
                      <Select 
                        defaultSelectedKeys={["15"]}
                        className="max-w-xs"
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <SelectItem key="15">15 mins before</SelectItem>
                        <SelectItem key="30">30 mins before</SelectItem>
                        <SelectItem key="45">45 mins before</SelectItem>
                      </Select>
                      <Button 
                        color="primary" 
                        size="sm"
                        onClick={() => handleSetAlert(interview.id)}
                      >
                        Set Alert
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardHeader className="flex gap-3">
              <Clock className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-xl font-bold">Approaching Job Deadlines</p>
                <p className="text-small text-default-500">Don't miss out on these opportunities</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {jobDeadlines.map(job => (
                  <div key={job.id} className="flex justify-between items-center p-3 rounded-lg">
                    <div>
                      <span className="block font-medium">{job.company}</span>
                      <span className="text-sm text-gray-500">{job.role}</span>
                      <span className="block text-sm text-gray-500">Deadline: {job.deadline}</span>
                    </div>
                    <Button color="primary" size="sm">Apply Now</Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Alerts;