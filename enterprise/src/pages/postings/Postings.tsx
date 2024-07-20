import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
} from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";

interface Posting {
  id: string;
  title: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
  openUntil: string;
}

interface LocationState {
  newPosting?: Posting;
}

const Postings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const savedPostings = localStorage.getItem('postings');
    if (savedPostings) {
      setPostings(JSON.parse(savedPostings));
    }
  }, []);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state && state.newPosting) {
      const updatedPostings = [...postings, state.newPosting];
      setPostings(updatedPostings);

      localStorage.setItem('postings', JSON.stringify(updatedPostings));

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, postings]);

  const filteredPostings = postings
    .filter(post => showInactive ? true : post.status === 'Active')
    .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDetailsClick = (posting: Posting) => {
    navigate(`/postings/${posting.id}/dashboard`, { state: { posting } });
  };

  return (
    <div>
      <div className="flex p-10 w-cover">
        <div className="min-w-[70%]">
          <h3>Postings</h3>
          <div className="flex gap-5 items-end justify-between max-w-[93%]">
            <Input
              className="mt-3 w-[70%]"
              placeholder="Search Postings"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Switch size="sm" checked={showInactive} onValueChange={setShowInactive}>
              Show Inactive
            </Switch>
          </div>
          <div className="flex gap-5 flex-wrap items-center mt-5">
            {filteredPostings.map((post) => (
              <Card key={post.id} className="w-[30%]">
                <CardHeader>{post.title}</CardHeader>
                <CardBody>
                  <div className="flex justify-between text-xs items-center">
                    <div>
                      <p className="text-sm">
                        <span className={`text-xs font-bold ${post.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                          {post.status}
                        </span>
                      </p>
                      <p className="text-xs opacity-50">{post.createdOn}</p>
                      <p className="text-xs">Open until: {post.openUntil}</p>
                    </div>
                    <Button variant="bordered" onClick={() => handleDetailsClick(post)}>Details</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
        <div className="h-cover border-1"></div>
        <div className="ml-5 w-full">
          <h3>Schedule</h3>
          <Card className="w-full py-2 mt-2">
            <CardBody>
              <div className="flex flex-col justify-start bg-card items-start rounded-lg">
                <p>No events scheduled</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Postings;