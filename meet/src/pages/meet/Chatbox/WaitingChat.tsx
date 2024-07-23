import { Button, Input } from "@nextui-org/react";
import Message from "./Message";
import { Send } from "lucide-react";

interface messageProps {
  name: string;
  message: string;
  sender: string;
  timestamp: string;
}

const WaitingChat = ({ chats }: { chats: messageProps[] }) => {
  return (
    <div>
      <div className="h-[66vh] overflow-y-scroll">
        {chats.map((chat, index) => (
          <Message
            key={index}
            name={chat.name}
            message={chat.message}
            sender={chat.sender}
            timestamp={chat.timestamp}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Input placeholder="Type a message" />
        <Button isIconOnly>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

export default WaitingChat;
