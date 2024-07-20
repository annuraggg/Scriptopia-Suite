import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Input,
  Button,
  useDisclosure,
  CardFooter,
} from "@nextui-org/react";
import { ChevronLeftIcon, PlusIcon, Download } from "lucide-react";
import AddParticipantModal from './AddParticipantModal';

interface Posting {
  id: string;
  title: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
  openUntil: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: 'Applied' | 'Aptitude' | 'Interview' | 'Evaluation';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const posting = location.state?.posting as Posting;
  const postingId = posting?.id || id;

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentStage, setCurrentStage] = useState<Participant['stage']>('Applied');
  const [newParticipant, setNewParticipant] = useState<Omit<Participant, 'id' | 'stage'>>({
    name: '',
    email: '',
    phone: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddParticipant = (stage: Participant['stage']) => {
    setCurrentStage(stage);
    onOpen();
  };

  const handleSubmitParticipant = () => {
    const participant: Participant = {
      ...newParticipant,
      id: Date.now().toString(),
      stage: currentStage,
    };
    setParticipants([...participants, participant]);
    setNewParticipant({ name: '', email: '', phone: '' });
    onClose();
  };

  const renderParticipantCards = (stage: Participant['stage']) => {
    return participants
      .filter(participant => participant.stage === stage)
      .map(participant => (
        <Card key={participant.id} className="w-full h-42 flex flex-col bg-zinc-800 p-1 gap-4">
          <CardBody className="flex flex-col gap-2">
            <p className="text-xl">{participant.name}</p>
            <p className="text-sm text-slate-400">{participant.email}</p>
            <p className="text-xl">{participant.phone}</p>
          </CardBody>
          <CardFooter className="flex flex-row h-10 items-center justify-center space-x-24 bg-zinc-900 rounded-3xl pb-2">
            <p className="text-sm mb-1">Resume</p>
            <Button size="sm" variant="light" className="flex flex-row rounded-3xl mb-1">
              <Download size={14} />
              <span className="text-xs">Get it</span>
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
        <p className='text-2xl'>{posting?.title || `Job #${postingId}`}</p>
      </div>

      <div className="flex flex-row items-start justify-start gap-4 w-full pt-6 pl-14">
        <Input placeholder="Name" className="mt-2 w-[50%]" />
      </div>

      <div className="flex flex-row items-center justify-start gap-8 w-[90%] pt-10 pl-14">
        {['Applied', 'Aptitude', 'Interview', 'Evaluation'].map((stage) => (
          <div key={stage} className="w-full h-full flex flex-col gap-4">
            <Card className="w-full h-40 flex flex-col">
              <CardBody className="flex flex-row items-center justify-center space-x-5 px-5">
                <div className="flex flex-row">
                  <p className="text-m">{stage} ({participants.filter(p => p.stage === stage).length})</p>
                </div>
                <Button size="sm" variant="light" className="flex flex-row" onClick={() => handleAddParticipant(stage as Participant['stage'])}>
                  <PlusIcon size={22} className="text-success-300" />
                  <span className="text-success-300 text-sm">Add Participants</span>
                </Button>
              </CardBody>
            </Card>
            <Card className="w-full h-full flex flex-col gap-3">
              <CardBody className="flex flex-col gap-4">
                {renderParticipantCards(stage as Participant['stage'])}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>

      <AddParticipantModal
        isOpen={isOpen}
        onClose={onClose}
        currentStage={currentStage}
        newParticipant={newParticipant}
        setNewParticipant={setNewParticipant}
        handleSubmitParticipant={handleSubmitParticipant}
      />
    </div>
  );
};

export default Dashboard;
