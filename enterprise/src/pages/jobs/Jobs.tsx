import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, CircleAlert, CircleDot } from "lucide-react";

interface Posting {
  id: string;
  title: string;
  createdOn: string;
  status: "active" | "inactive";
  openUntil: string;
}

const postingsSample: Posting[] = [
  {
    id: "1",
    title: "React App Developer",
    createdOn: "23 May 2023",
    status: "active",
    openUntil: "30 June 2023",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    createdOn: "15 June 2023",
    status: "active",
    openUntil: "31 July 2023",
  },
  {
    id: "3",
    title: "Frontend Developer",
    createdOn: "10 July 2023",
    status: "inactive",
    openUntil: "15 August 2023",
  },
  {
    id: "4",
    title: "Backend Developer",
    createdOn: "5 August 2023",
    status: "active",
    openUntil: "30 September 2023",
  },
  {
    id: "5",
    title: "UI/UX Designer",
    createdOn: "18 September 2023",
    status: "inactive",
    openUntil: "31 October 2023",
  },
  {
    id: "6",
    title: "Software Engineer",
    createdOn: "22 October 2023",
    status: "active",
    openUntil: "15 November 2023",
  },
  {
    id: "7",
    title: "Data Scientist",
    createdOn: "9 November 2023",
    status: "inactive",
    openUntil: "30 December 2023",
  },
  {
    id: "8",
    title: "Cloud Architect",
    createdOn: "14 December 2023",
    status: "active",
    openUntil: "31 January 2024",
  },
  {
    id: "9",
    title: "DevOps Engineer",
    createdOn: "27 January 2024",
    status: "inactive",
    openUntil: "28 February 2024",
  },
  {
    id: "10",
    title: "Product Manager",
    createdOn: "8 February 2024",
    status: "active",
    openUntil: "31 March 2024",
  },
  {
    id: "11",
    title: "Machine Learning Engineer",
    createdOn: "12 March 2024",
    status: "inactive",
    openUntil: "30 April 2024",
  },
  {
    id: "12",
    title: "Cybersecurity Analyst",
    createdOn: "25 April 2024",
    status: "active",
    openUntil: "31 May 2024",
  },
  {
    id: "13",
    title: "Mobile App Developer",
    createdOn: "7 May 2024",
    status: "inactive",
    openUntil: "30 June 2024",
  },
  {
    id: "14",
    title: "Blockchain Developer",
    createdOn: "19 June 2024",
    status: "active",
    openUntil: "31 July 2024",
  },
  {
    id: "15",
    title: "Game Developer",
    createdOn: "2 July 2024",
    status: "inactive",
    openUntil: "31 August 2024",
  },
  {
    id: "16",
    title: "Network Engineer",
    createdOn: "14 August 2024",
    status: "active",
    openUntil: "30 September 2024",
  },
  {
    id: "17",
    title: "QA Engineer",
    createdOn: "27 September 2024",
    status: "inactive",
    openUntil: "31 October 2024",
  },
  {
    id: "18",
    title: "Technical Writer",
    createdOn: "8 October 2024",
    status: "active",
    openUntil: "30 November 2024",
  },
  {
    id: "19",
    title: "Systems Administrator",
    createdOn: "21 November 2024",
    status: "inactive",
    openUntil: "31 December 2024",
  },
  {
    id: "20",
    title: "AI Research Scientist",
    createdOn: "3 December 2024",
    status: "active",
    openUntil: "31 January 2025",
  },
];

const Postings: React.FC = () => {
  const navigate = useNavigate();
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setPostings(postingsSample);
  }, []);

  const filteredPostings = postings
    .filter((post) => (showInactive ? true : post.status === "active"))
    .filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDetailsClick = (posting: Posting) => {
    navigate(`${posting.id}/dashboard`);
  };

  return (
    <>
      <div>
        <div className="flex gap-5 w-full p-5">
          <div>
            <h4>Postings</h4>
            <div className="flex gap-5 items-end justify-between w-full">
              <Input
                className="mt-3 w-[70%]"
                placeholder="Search Postings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Switch
                size="sm"
                checked={showInactive}
                onValueChange={setShowInactive}
              >
                Show Inactive
              </Switch>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-7 w-full">
              {filteredPostings.map((post) => (
                <Card key={post.id} className="w-[32%]">
                  <CardHeader>{post.title}</CardHeader>
                  <CardBody>
                    <div className="flex justify-between text-xs items-center">
                      <div>
                        <p className="text-sm">
                          <span
                            className={`text-xs font-bold flex items-center gap-1 mb-2 ${
                              post.status === "active"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {post.status === "active" ? (
                              <CircleDot size={12} />
                            ) : (
                              <CircleAlert size={12} />
                            )}
                            {post.status.slice(0, 1).toUpperCase() +
                              post.status.slice(1)}
                          </span>
                        </p>

                        <p className="text-xs">Open until: {post.openUntil}</p>
                      </div>
                      <Button
                        variant="flat"
                        onClick={() => handleDetailsClick(post)}
                        isIconOnly
                      >
                        <ChevronRight />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Postings;
