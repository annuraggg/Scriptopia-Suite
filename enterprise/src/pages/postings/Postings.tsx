import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Switch,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ChevronRight, CircleAlert, CircleDot } from "lucide-react";

interface Posting {
  id: string;
  title: string;
  createdOn: string;
  status: "active" | "inactive";
  openUntil: string;
}

interface Calendar {
  event: string;
  time: string;
  date: string;
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

const calendarSample = [
  {
    date: "7/18/2024",
    time: "08:42:38 PM",
    event: "Sed quia molestiae et.",
  },
  {
    date: "6/29/2024",
    time: "07:24:09 AM",
    event: "Non libero nemo.",
  },
  {
    date: "7/27/2024",
    time: "11:52:56 AM",
    event: "Sapiente sint doloribus.",
  },
  {
    date: "6/27/2024",
    time: "01:36:01 AM",
    event: "Qui est quo.",
  },
  {
    date: "7/31/2024",
    time: "02:30:25 AM",
    event: "Laboriosam assumenda ut.",
  },
  {
    date: "6/25/2024",
    time: "07:45:35 AM",
    event: "Sed voluptatem quos.",
  },
  {
    date: "6/23/2024",
    time: "07:16:06 AM",
    event: "Molestiae et adipisci.",
  },
  {
    date: "7/21/2024",
    time: "04:54:54 AM",
    event: "Reprehenderit non ut.",
  },
  {
    date: "7/30/2024",
    time: "02:55:29 AM",
    event: "Voluptatem nisi vitae.",
  },
  {
    date: "7/22/2024",
    time: "12:10:01 AM",
    event: "Quis dolorem molestiae.",
  },
  {
    date: "7/18/2024",
    time: "02:05:03 PM",
    event: "Sed nisi id.",
  },
  {
    date: "7/26/2024",
    time: "12:01:08 PM",
    event: "Facilis sunt voluptatem.",
  },
  {
    date: "6/24/2024",
    time: "05:54:57 AM",
    event: "Quisquam molestias sequi.",
  },
  {
    date: "6/25/2024",
    time: "03:08:09 AM",
    event: "Quasi est architecto.",
  },
  {
    date: "6/23/2024",
    time: "01:16:25 AM",
    event: "Rerum ipsum enim.",
  },
  {
    date: "7/28/2024",
    time: "03:13:29 AM",
    event: "Doloribus officiis repellendus.",
  },
  {
    date: "7/19/2024",
    time: "11:20:42 AM",
    event: "Ex aspernatur ut.",
  },
  {
    date: "6/26/2024",
    time: "12:32:53 AM",
    event: "Consequatur sunt amet.",
  },
  {
    date: "7/29/2024",
    time: "07:17:27 PM",
    event: "Nobis ut magni.",
  },
  {
    date: "6/27/2024",
    time: "10:13:10 AM",
    event: "Quod et nihil.",
  },
  {
    date: "6/30/2024",
    time: "06:11:47 AM",
    event: "Maxime non autem.",
  },
  {
    date: "7/24/2024",
    time: "06:38:21 AM",
    event: "Ea non facere.",
  },
  {
    date: "6/28/2024",
    time: "08:20:51 PM",
    event: "Tempora ut sunt.",
  },
  {
    date: "7/25/2024",
    time: "11:02:47 PM",
    event: "Dolorem id quia.",
  },
  {
    date: "6/28/2024",
    time: "01:10:41 PM",
    event: "Quam quos sit.",
  },
  {
    date: "7/20/2024",
    time: "07:05:37 AM",
    event: "Quibusdam harum aut.",
  },
  {
    date: "6/29/2024",
    time: "04:32:45 AM",
    event: "Amet aut illum.",
  },
  {
    date: "6/30/2024",
    time: "01:18:12 AM",
    event: "Est et sunt.",
  },
  {
    date: "7/19/2024",
    time: "09:57:44 AM",
    event: "Eveniet ad iste.",
  },
  {
    date: "7/23/2024",
    time: "09:44:02 AM",
    event: "Sit minima sit.",
  },
];

const Postings: React.FC = () => {
  const navigate = useNavigate();
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [calendar, setCalendar] = useState<Calendar[]>([]);

  useEffect(() => {
    setPostings(postingsSample);
    setCalendar(calendarSample);
  }, []);

  const filteredPostings = postings
    .filter((post) => (showInactive ? true : post.status === "active"))
    .filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDetailsClick = (posting: Posting) => {
    navigate(`/postings/${posting.id}/dashboard`, { state: { posting } });
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="flex p-10 gap-5 w-full">
          <div className="min-w-[70%] w-[70%]">
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
          <div className="h-cover border-1"></div>
          <div className="ml-5 w-full py-3">
            <h4 className="mb-5">Schedule</h4>
            {calendar.length === 0 && "No Events Yet"}
            {calendar.map((event, i) =>
              i > 10 ? (
                ""
              ) : (
                <Card className="w-full mt-3">
                  <CardBody className="p-0">
                    <div className="flex gap-3 items-center h-[10vh] px-5">
                      <div className="text-xs opacity-70 h-full flex flex-col justify-center items-start w-[25%]">
                        <p>{event.date}</p>
                        <p>{event.time}</p>
                      </div>

                      <Divider className="h-full" orientation="vertical" />
                      {event.event}
                    </div>
                  </CardBody>
                </Card>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Postings;
