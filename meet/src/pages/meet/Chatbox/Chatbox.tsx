import { Tabs, Tab } from "@nextui-org/react";
import InMeet from "./InMeet";
import WaitingChat from "./WaitingChat";
import { useEffect, useState } from "react";

interface messageProps {
  name: string;
  message: string;
  sender: string;
  timestamp: string;
}

const Chatbox = ({ isOpen }: { isOpen: boolean }) => {
  const [meetingChat, setMeetingChat] = useState<messageProps[]>([]);
  const [waitingChat, setWaitingChat] = useState<messageProps[]>([]);

  useEffect(() => {
    const meetingMessages = [
      {
        name: "Anurag",
        message: "Hello",
        sender: "Anurag",
        timestamp: "12:00",
      },
      {
        name: "You",
        message: "Hi",
        sender: "you",
        timestamp: "12:01",
      },
      {
        name: "You",
        message: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat a ex, repudiandae consectetur nihil suscipit aliquam optio rerum beatae ducimus. Ullam sit molestias nihil pariatur minima ratione laboriosam natus accusantium.
        Doloribus recusandae voluptatibus iure rerum? Deserunt corporis, suscipit inventore natus nam sed sit quo beatae accusantium eos a neque laboriosam unde iste minus quasi qui. Voluptate vitae sit ratione vel.
        Animi sunt eligendi voluptatibus rerum nesciunt cum aliquid alias soluta non commodi, rem nihil, eos corporis cupiditate! Obcaecati, qui temporibus! Ea fugit rem cumque quo hic enim modi, quidem odit.
        Ducimus, harum? Molestiae sed maxime fuga itaque cupiditate ut accusantium similique incidunt. Eos, voluptate optio. Quibusdam doloremque praesentium numquam veritatis voluptas sunt beatae velit. Voluptatem enim omnis laudantium nemo officia.
        Suscipit odit facilis error reprehenderit amet provident veritatis est, repudiandae dignissimos animi maxime distinctio doloremque praesentium facere cumque placeat necessitatibus assumenda aut optio fugit rem eum possimus. Excepturi, illum quae?`,
        sender: "you",
        timestamp: "12:01",
      },
      {
        name: "Anurag",
        message: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat a ex, repudiandae consectetur nihil suscipit aliquam optio rerum beatae ducimus. Ullam sit molestias nihil pariatur minima ratione laboriosam natus accusantium.
        Doloribus recusandae voluptatibus iure rerum? Deserunt corporis, suscipit inventore natus nam sed sit quo beatae accusantium eos a neque laboriosam unde iste minus quasi qui. Voluptate vitae sit ratione vel.
        Animi sunt eligendi voluptatibus rerum nesciunt cum aliquid alias soluta non commodi, rem nihil, eos corporis cupiditate! Obcaecati, qui temporibus! Ea fugit rem cumque quo hic enim modi, quidem odit.
        Ducimus, harum? Molestiae sed maxime fuga itaque cupiditate ut accusantium similique incidunt. Eos, voluptate optio. Quibusdam doloremque praesentium numquam veritatis voluptas sunt beatae velit. Voluptatem enim omnis laudantium nemo officia.
        Suscipit odit facilis error reprehenderit amet provident veritatis est, repudiandae dignissimos animi maxime distinctio doloremque praesentium facere cumque placeat necessitatibus assumenda aut optio fugit rem eum possimus. Excepturi, illum quae?`,
        sender: "Anurag",
        timestamp: "12:01",
      },
    ];

    const userMessages = [
      {
        name: "Anurag",
        message: "Hello",
        sender: "User",
        timestamp: "12:00",
      },
      {
        name: "Anurag",
        message: "Hi",
        sender: "Admin",
        timestamp: "12:01",
      },
    ];

    setMeetingChat(meetingMessages);
    setWaitingChat(userMessages);
  }, []);

  return (
    <div
      className={`${
        isOpen ? " translate-x-0" : "translate-x-[110%]"
      } duration-300 bg-blue-500 border translate-all animate__animated max-h-[100vh] rounded-xl absolute right-5  bg-card p-3 w-[350px]`}
    >
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" fullWidth variant="underlined">
          <Tab key="meeting" title="In Meeting">
            <InMeet chats={meetingChat} />
          </Tab>
          <Tab key="waiting" title="Waiting Room">
            <WaitingChat chats={waitingChat} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Chatbox;
