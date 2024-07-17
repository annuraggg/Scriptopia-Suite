import Navbar from "@/components/Navbar";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
} from "@nextui-org/react";

const Postings = () => {
  const postings = [
    {
      title: "React App Developer",
      createdOn: "23 May 2023",
    },
    {
      title: "Full Stack Engineer",
      createdOn: "15 June 2023",
    },
    {
      title: "Frontend Developer",
      createdOn: "10 July 2023",
    },
    {
      title: "Backend Developer",
      createdOn: "5 August 2023",
    },
    {
      title: "UI/UX Designer",
      createdOn: "18 September 2023",
    },
    {
      title: "Software Engineer",
      createdOn: "22 October 2023",
    },
    {
      title: "Data Scientist",
      createdOn: "9 November 2023",
    },
    {
      title: "Cloud Architect",
      createdOn: "14 December 2023",
    },
    {
      title: "DevOps Engineer",
      createdOn: "27 January 2024",
    },
    {
      title: "Product Manager",
      createdOn: "8 February 2024",
    },
    {
      title: "Machine Learning Engineer",
      createdOn: "12 March 2024",
    },
    {
      title: "Cybersecurity Analyst",
      createdOn: "25 April 2024",
    },
    {
      title: "Mobile App Developer",
      createdOn: "7 May 2024",
    },
    {
      title: "Blockchain Developer",
      createdOn: "19 June 2024",
    },
    {
      title: "Game Developer",
      createdOn: "2 July 2024",
    },
    {
      title: "Network Engineer",
      createdOn: "14 August 2024",
    },
    {
      title: "QA Engineer",
      createdOn: "27 September 2024",
    },
    {
      title: "Technical Writer",
      createdOn: "8 October 2024",
    },
    {
      title: "Systems Administrator",
      createdOn: "21 November 2024",
    },
    {
      title: "AI Research Scientist",
      createdOn: "3 December 2024",
    },
  ];

  const calendar = [
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

  return (
    <div>
      <Navbar />
      <div className="flex p-10 w-cover">
        <div className="min-w-[70%]">
          <h3>Postings</h3>
          <div className="flex gap-5 items-end justify-between max-w-[93%]">
            <Input className="mt-3 w-[70%]" placeholder="Search Postings" />
            <Switch size="sm">Show Inactive</Switch>
          </div>
          <div className="flex gap-5 flex-wrap items-center mt-5">
            {postings.map((post, i) => (
              <Card key={i} className=" w-[30%] ">
                <CardHeader>{post.title}</CardHeader>
                <CardBody>
                  <div className="flex justify-between text-xs items-center">
                    <div>
                      <p className="text-sm">
                        <span className="text-xs text-green-500 font-bold">
                          Active
                        </span>
                      </p>
                      <p className="text-xs opacity-50">{post.createdOn}</p>
                    </div>
                    <Button variant="bordered">Details</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
        <div className="h-cover border-1"></div>
        <div className="ml-5 w-full">
          <h3>Schedule</h3>
          {calendar.map((event, i) => (
            <Card key={i} className="w-full py-3 mt-3">
              <CardBody>
                <div className="flex justify-between bg-card items-center rounded-lg">
                  <div>
                    <p className="text-sm">{event.date}</p>
                    <p className="text-sm">{event.time}</p>
                  </div>
                  <div className="w-[50%] text-right">
                    <p>{event.event}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Postings;
