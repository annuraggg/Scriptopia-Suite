import React from 'react';
import {
  Card,
  CardBody,
  Input,
  Button,
  Link,
  CardFooter,
} from "@nextui-org/react";
import { Download, PlusIcon, ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
}


const appliedCandidates: Candidate[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 123-4567' },
  { id: '2', name: 'Emma Johnson', email: 'emma.j@example.com', phone: '(555) 987-6543' },
  { id: '3', name: 'Michael Brown', email: 'm.brown@example.com', phone: '(555) 246-8135' },
];

const aptitudeCandidates: Candidate[] = [
  { id: '4', name: 'Sophia Lee', email: 'sophia.lee@example.com', phone: '(555) 369-2580' },
  { id: '5', name: 'William Davis', email: 'w.davis@example.com', phone: '(555) 147-2589' },
];

const interviewCandidates: Candidate[] = [
  { id: '6', name: 'Olivia Wilson', email: 'o.wilson@example.com', phone: '(555) 753-9514' },
];

const evaluationCandidates: Candidate[] = [
  { id: '7', name: 'James Taylor', email: 'j.taylor@example.com', phone: '(555) 951-7532' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const renderCandidateCards = (candidates: Candidate[]) => {
    return candidates.map(candidate => (
      <Card key={candidate.id} className="w-full h-42 flex flex-col bg-zinc-800 p-1 gap-4">
        <CardBody className="flex flex-col gap-2">
          <p className="text-xl">{candidate.name}</p>
          <p className="text-sm text-slate-400">{candidate.email}</p>
          <p className="text-xl">{candidate.phone}</p>
        </CardBody>
        <CardFooter className="flex flex-row h-10 items-center justify-center space-x-36 bg-zinc-900 rounded-3xl pb-2">
          <p className="text-sm">Resume</p>
          <Button size="sm" variant="light" className="flex flex-row rounded-3xl">
            <Download size={14} className="" />
            <Link className="text-xs">Get it</Link>
          </Button>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="flex flex-col items-start justify-start p-10 pt-5 h-screen w-full">
      <div className="flex flex-row items-center justify-start gap-4 w-full">
        <ChevronLeftIcon size={46} className="text-slate-400" onClick={() => navigate('/postings')} />
        <p className='text-xl'>Jobs</p>
        <p className='text-2xl'>Full stack Developer</p>
      </div>

      <div className="flex flex-row items-start justify-start gap-4 w-full pt-6 pl-14">
        <Input placeholder="Name" className="mt-2 w-[50%]" />
      </div>

      <div className="flex flex-row items-center justify-start gap-8 w-[90%] pt-10 pl-14">
        <div className="w-full h-full flex flex-col gap-4">
          <Card className="w-full h-20 flex flex-col">
            <CardBody className="flex flex-row items-center justify-center space-x-10">
              <div className="flex flex-row">
                <p className="text-lg">Applied ({appliedCandidates.length})</p>
              </div>
              <Button size="sm" variant="light" className="flex flex-row">
                <PlusIcon size={22} className="text-slate-400" />
                <Link className="text-slate-400 text-sm"> Add Participants</Link>
              </Button>
            </CardBody>
          </Card>
          <Card className="w-full h-full flex flex-col gap-3">
            <CardBody className="flex flex-col gap-4">
              {renderCandidateCards(appliedCandidates)}
            </CardBody>
          </Card>
        </div>

        <div className="w-full h-full flex flex-col gap-4">
          <Card className="w-full h-20 flex flex-col">
            <CardBody className="flex flex-row items-center justify-center space-x-10">
              <div className="flex flex-row">
                <p className="text-lg">Aptitude ({aptitudeCandidates.length})</p>
              </div>
              <Button size="sm" variant="light" className="flex flex-row">
                <PlusIcon size={22} className="text-slate-400" />
                <Link className="text-slate-400 text-sm"> Add Participants</Link>
              </Button>
            </CardBody>
          </Card>
          <Card className="w-full h-full flex flex-col gap-3">
            <CardBody className="flex flex-col gap-4">
              {renderCandidateCards(aptitudeCandidates)}
            </CardBody>
          </Card>
        </div>

        <div className="w-full h-full flex flex-col gap-4">
          <Card className="w-full h-20 flex flex-col">
            <CardBody className="flex flex-row items-center justify-center space-x-10">
              <div className="flex flex-row">
                <p className="text-lg">Interview ({interviewCandidates.length})</p>
              </div>
              <Button size="sm" variant="light" className="flex flex-row">
                <PlusIcon size={22} className="text-slate-400" />
                <Link className="text-slate-400 text-sm"> Add Participants</Link>
              </Button>
            </CardBody>
          </Card>
          <Card className="w-full h-full flex flex-col gap-3">
            <CardBody className="flex flex-col gap-4">
              {renderCandidateCards(interviewCandidates)}
            </CardBody>
          </Card>
        </div>

        <div className="w-full h-full flex flex-col gap-4">
          <Card className="w-full h-20 flex flex-col">
            <CardBody className="flex flex-row items-center justify-center space-x-8">
              <div className="flex flex-row">
                <p className="text-lg">Evaluation ({evaluationCandidates.length})</p>
              </div>
              <Button size="sm" variant="light" className="flex flex-row">
                <PlusIcon size={22} className="text-slate-400" />
                <Link className="text-slate-400 text-sm"> Add Participants</Link>
              </Button>
            </CardBody>
          </Card>
          <Card className="w-full h-full flex flex-col gap-3">
            <CardBody className="flex flex-col gap-4">
              {renderCandidateCards(evaluationCandidates)}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;